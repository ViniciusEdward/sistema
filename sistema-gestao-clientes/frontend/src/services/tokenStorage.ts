const TOKEN_KEY = 'sgc_access_token';
let memoryToken: string | null = null;

export function getAccessToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY) || memoryToken;
  } catch {
    return memoryToken;
  }
}

export function setAccessToken(token: string) {
  memoryToken = token;

  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Safari/Chrome mobile em modo privado pode bloquear localStorage.
    // O token em memória continua funcionando enquanto a aba estiver aberta.
  }
}

export function clearAccessToken() {
  memoryToken = null;

  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Sem ação necessária.
  }
}
