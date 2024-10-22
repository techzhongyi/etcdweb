export const setStorage = (key: any, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};
export const getStorage = (key: any) => {
  try {
    const value = localStorage.getItem(key);
    if (value === null || value === undefined || value === '') {
      return null;
    }
    return JSON.parse(localStorage.getItem(key));
  } catch (err) {
    return null;
  }
};
export const clearStorage = (key: any) => {
  localStorage.removeItem(key);
};
export const clearAllStorage = () => {
  localStorage.clear();
};

export function setSession(name: string, value: any) {
  if (typeof sessionStorage === 'object') {
    var data = value;
    if (typeof value !== 'string') {
      if (data === undefined) {
        data = null;
      } else {
        data = JSON.stringify(data);
      }
    }
    sessionStorage.setItem(name, data);
  }
}

export function getSession(name: string) {
  if (typeof sessionStorage === 'object') {
    var data = sessionStorage.getItem(name) || '';
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }
  return null;
}
