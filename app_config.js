const atServer = false; // Change this value to false for local configuration

const config = {
  uploadUrl: atServer
    ? 'http://awgp.guru:8084/upload2'
    : 'http://127.0.0.1:8000/upload2/',
  downloadUrl: atServer
    ? 'http://api.example.com/download'
    : 'http://127.0.0.1:8000/download2/',
};

export default config;