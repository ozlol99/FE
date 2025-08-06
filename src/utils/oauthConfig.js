import googleLogo from '@/assets/google.svg';
import kakaoLogo from '@/assets/kakao.svg';

export const OAUTH_CONFIG = {
  google: {
    client_id:
      '439433135354-ubr0g0do3cg9c1u0uakuenulmq4q30m4.apps.googleusercontent.com',
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
    client_id: '3135c81f670ad77342b9a1018ac79843',
    url: 'https://kauth.kakao.com/oauth/authorize',
    color: 'bg-gray-900 hover:bg-[#FEE500]',
    logo: kakaoLogo,
    params: {
      response_type: 'code',
    },
  },
};

export const REDIRECT_URI = 'http://localhost:5173/auth/callback';

export function createOauthUrl(provider) {
  const { client_id, url, params } = OAUTH_CONFIG[provider];
  const query = new URLSearchParams({
    client_id,
    redirect_uri: REDIRECT_URI,
    ...params,
  }).toString();
  return `${url}?${query}`;
}
