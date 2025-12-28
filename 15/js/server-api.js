const ServerConfig = {
    baseUrl: 'https://29.javascript.htmlacademy.pro/kekstagram',
    endpoints: {
      photos: '/data',
      upload: '/'
    },
    timeout: 10000,
    retries: 3
  };
  
  const ErrorMessages = {
    loadPhotos: 'Не удалось загрузить фотографии. Попробуйте позже',
    sendForm: 'Ошибка отправки формы. Проверьте соединение',
    network: 'Проблемы с сетью. Проверьте подключение',
    server: 'Ошибка сервера. Попробуйте позже'
  };
  
  async function makeRequest(url, options = {}) {
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body,
      signal: AbortSignal.timeout(ServerConfig.timeout)
    };
  
    let lastError;
    
    for (let attempt = 1; attempt <= ServerConfig.retries; attempt++) {
      try {
        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        lastError = error;
        
        if (attempt === ServerConfig.retries) {
          console.warn(`Попытка ${attempt} не удалась:`, error.message);
        }
        
        if (attempt < ServerConfig.retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    throw lastError;
  }
  
  async function fetchPhotoCollection() {
    try {
      const photosUrl = `${ServerConfig.baseUrl}${ServerConfig.endpoints.photos}`;
      const photoData = await makeRequest(photosUrl);
      
      if (!Array.isArray(photoData)) {
        throw new Error('Некорректный формат данных');
      }
      
      return photoData;
    } catch (error) {
      console.error('Ошибка загрузки фотографий:', error);
      
      let userMessage = ErrorMessages.loadPhotos;
      if (error.name === 'TimeoutError' || error.message.includes('network')) {
        userMessage = ErrorMessages.network;
      } else if (error.message.includes('HTTP')) {
        userMessage = ErrorMessages.server;
      }
      
      throw new Error(userMessage);
    }
  }
  
  async function submitFormData(formData) {
    try {
      const uploadUrl = `${ServerConfig.baseUrl}${ServerConfig.endpoints.upload}`;
      
      const response = await makeRequest(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {}
      });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      
      let userMessage = ErrorMessages.sendForm;
      if (error.name === 'TimeoutError' || error.message.includes('network')) {
        userMessage = ErrorMessages.network;
      } else if (error.message.includes('HTTP')) {
        userMessage = ErrorMessages.server;
      }
      
      return {
        success: false,
        error: userMessage
      };
    }
  }
  
  async function checkServerAvailability() {
    try {
      const testUrl = `${ServerConfig.baseUrl}${ServerConfig.endpoints.photos}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(testUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      return response.ok;
    } catch {
      return false;
    }
  }
  
  export { fetchPhotoCollection, submitFormData, checkServerAvailability };