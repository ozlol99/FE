import googleLogo from '@/assets/google.svg';
import kakaoLogo from '@/assets/kakao.svg';

export const OAUTH_CONFIG = {
  google: {
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    url: 'https://accounts.google.com/o/oauth2/v2/auth',
    color: 'bg-gray-900 hover:bg-black',
    logo: googleLogo,
    params: {
      response_type: 'code',
      scope: 'openid email profile',
      include_granted_scopes: 'true',
      access_type: 'offline',
    },
  },
  kakao: {
    client_id: import.meta.env.VITE_KAKAO_CLIENT_ID,
    url: 'https://kauth.kakao.com/oauth/authorize',
    color: 'bg-gray-900 hover:bg-[#FEE500]',
    logo: kakaoLogo,
    params: {
      response_type: 'code',
    },
  },
};

export const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

export function createOauthUrl(provider) {
  const { client_id, url, params } = OAUTH_CONFIG[provider];
  const query = new URLSearchParams({
    client_id,
    redirect_uri: REDIRECT_URI,
    ...params,
  }).toString();
  return `${url}?${query}`;
}
