import FingerprintJS from '@fingerprintjs/fingerprintjs';

class AppState {
    private static instance: AppState;
    private fingerprint: string | null = null;
  
    private constructor() {}
  
    public static getInstance(): AppState {
      if (!AppState.instance) {
        AppState.instance = new AppState();
      }
      return AppState.instance;
    }
  
    public async getFingerprint(): Promise<string> {
      if (!this.fingerprint) {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        console.log("Fingerprint result:", result);
        this.fingerprint = result.visitorId;
      }
      return this.fingerprint;
    }
  }
  
  export default AppState;
  