export function isValidUrl(text: string) {
    try {
      new URL(text);
    } catch (_) {
      return false;  
    }
  
    return true;
  }