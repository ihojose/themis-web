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
    get_role: `${ host }/role/{id}`,
    delete_role: `${ host }/role/{id}`,
    add_role: `${ host }/role`,
    edit_role: `${ host }/role/{id}`,
    add_permission: `${ host }/permission`,
    edit_permission: `${ host }/permission/{id}`,
    delete_permission: `${ host }/permission/{id}`,
  }
};
