/**
 * Holds all feature flags can use static properties or getters for enabling
 * or showing features
 */
import {environment} from '../../environments/environment';

export const features = {

  /**
   * Log streaming flag. Waiting on MS-2590 and related tickets
   * @returns {boolean}
   */
  get logStreaming() {
    // switch to return true, or remove embedded flags for enabling
    return environment.name === 'dev';
  },

  /**
   * Direct Start flag. Waiting on MS-2623 and related tickets
   * @returns {boolean}
   */
  get directStart() {
    // switch to return true, or remove embedded flags for enabling
    return environment.name === 'mock';
  }

};
