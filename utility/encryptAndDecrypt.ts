const cryptoService = {
    encrypt: (data: string): string => {
      // Dummy encryption for demonstration purposes
      return Buffer.from(data).toString('base64');
    },
    decrypt: (data: string): string => {
      // Dummy decryption for demonstration purposes
      return Buffer.from(data, 'base64').toString('utf-8');
    }
  };
  
  export default cryptoService;
  