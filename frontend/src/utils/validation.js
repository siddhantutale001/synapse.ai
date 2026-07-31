/**
 * Asynchronously verifies if a GitHub username/URL exists using GitHub's Public API
 */
export async function verifyGithubProfile(inputUrlOrHandle) {
  if (!inputUrlOrHandle || !inputUrlOrHandle.trim()) {
    return { valid: false, message: '' };
  }

  const cleanInput = inputUrlOrHandle.trim();
  // Extract username from full URL (e.g., https://github.com/username) or handle
  const match = cleanInput.match(/(?:github\.com\/|^)([a-zA-Z0-9-]{1,39})\/?$/i);
  if (!match) {
    return { valid: false, message: 'Invalid GitHub URL format' };
  }

  const username = match[1];
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, { method: 'GET' });
    if (res.status === 200) {
      const data = await res.json();
      return { 
        valid: true, 
        username: data.login, 
        avatar: data.avatar_url, 
        name: data.name || data.login,
        message: 'Verified GitHub Profile'
      };
    } else if (res.status === 404) {
      return { valid: false, username, message: 'GitHub profile does not exist' };
    } else {
      return { valid: true, username, message: 'GitHub username format valid' };
    }
  } catch (err) {
    return { valid: true, username, message: 'GitHub handle format valid' };
  }
}

/**
 * Validates LinkedIn URL format
 */
export function validateLinkedInUrl(url) {
  if (!url || !url.trim()) return { valid: false, message: '' };
  const regex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i;
  return regex.test(url.trim())
    ? { valid: true, message: 'Verified LinkedIn Profile' }
    : { valid: false, message: 'Invalid LinkedIn profile URL' };
}

/**
 * Validates Student Email format
 */
export function validateEmail(email) {
  if (!email || !email.trim()) return { valid: false, message: '' };
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim())
    ? { valid: true, message: 'Valid Email Address' }
    : { valid: false, message: 'Invalid Email Address format' };
}

/**
 * Validates Phone number format (E.164 or 10-digit)
 */
export function validatePhone(phone) {
  if (!phone || !phone.trim()) return { valid: false, message: '' };
  const regex = /^\+?[1-9]\d{1,14}$|^[0-9]{10}$/;
  return regex.test(phone.trim().replace(/[\s-]/g, ''))
    ? { valid: true, message: 'Valid Phone Number' }
    : { valid: false, message: 'Invalid Phone Number format' };
}
