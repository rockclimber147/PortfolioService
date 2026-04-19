export abstract class ApiServiceBase {
  protected readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Error: ${response.status}`);
    }
    
    if (response.status === 204) {
      return null as T;
    }

    const text = await response.text();
    try {
      return text ? JSON.parse(text) : (null as T);
    } catch (e) {
      // Catch cases where status was 200/201 but body was malformed
      console.error("Failed to parse JSON response:", text);
      throw new Error("Invalid JSON response from server");
    }
  }
}