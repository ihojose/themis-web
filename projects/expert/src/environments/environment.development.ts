export const host: string = 'http://[::1]:3000';

export const environment: any = {
  notification: {
    duration: 5000
  },
  api: {
    auth: `${ host }/account/auth`,
    get_sessions: `${ host }/session/{user}`,
    get_history: `${ host }/history/session/{session}`,
    get_roles: `${ host }/role`,
  }
};
