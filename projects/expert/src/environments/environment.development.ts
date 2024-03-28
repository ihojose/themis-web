export const host: string = 'http://[::1]:3000';

export const environment: any = {
  notification: {
    duration: 5000
  },
  api: {
    // account
    auth: `${ host }/account/auth`,

    // session
    get_sessions: `${ host }/session/{user}`,
    get_history: `${ host }/history/session/{session}`,

    // roles and permissions
    get_roles: `${ host }/role`,
    get_role: `${ host }/role/{id}`,
    delete_role: `${ host }/role/{id}`,
    add_role: `${ host }/role`,
    edit_role: `${ host }/role/{id}`,
    add_permission: `${ host }/permission`,
    edit_permission: `${ host }/permission/{id}`,
    delete_permission: `${ host }/permission/{id}`,

    // laws
    get_laws: `${ host }/law`,
    get_law: `${ host }/law/{id}`,
    add_law: `${ host }/law`,
    edit_law: `${ host }/law/{id}`,
    delete_law: `${ host }/law/{id}`,

    // article
    get_articles: `${ host }/article/{id}`,
    add_article: `${ host }/article`,
    edit_article: `${ host }/article/{id}`,
    delete_article: `${ host }/article/{id}`,

    // desicion tree
    get_aggravating: `${ host }/aggravating/{id}`,
    get_aggravating_list: `${ host }/aggravating`,
    get_aggravating_by_article: `${ host }/aggravating/article/{id}`,
    add_aggravating: `${ host }/aggravating`,
    edit_aggravating: `${ host }/aggravating/{id}`,
    delete_aggravating: `${ host }/aggravating/{id}`,
    add_asnwer: `${ host }/aggravating/answer`,
    edit_asnwer: `${ host }/aggravating/answer/{id}`,
    delete_asnwer: `${ host }/aggravating/answer/{id}`,
    ref_sentence: `${ host }/aggravating/answer/sentence`,
    delete_ref_sentence: `${ host }/aggravating/answer/{1}/sentence/{2}`,

    // sentence
    get_sentences: `${ host }/sentence`,
    get_sentence: `${ host }/sentence/{id}`,
    add_sentence: `${ host }/sentence`,
    edit_sentence: `${ host }/sentence/{id}`,
    delete_sentence: `${ host }/sentence/{id}`,
    add_verdict: `${ host }/sentence/verdict`,
    get_verdicts: `${ host }/sentence/verdict`,
    get_verdict: `${ host }/sentence/verdict/{id}`,
  }
};
