import googleLogo from '@/assets/google.svg';
import kakaoLogo from '@/assets/kakao.svg';

// export const OAUTH_CONFIG = {
//   google: {
//     client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
//     auth_base: 'https://accounts.google.com/o/oauth2/v2/auth',
//     scope: 'openid email profile',
//     redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI, // http://localhost:8000/google-login
//     logo: googleLogo,
//     color: 'bg-gray-900 hover:bg-black',
//   },
//   kakao: {
//     client_id: import.meta.env.VITE_KAKAO_CLIENT_ID,
//     auth_base: 'https://kauth.kakao.com/oauth/authorize',
//     redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
//     scope: '',
//     logo: kakaoLogo,
//     color: 'bg-gray-900 hover:bg-[#FEE500]',
//   },
// };
export const OAUTH_CONFIG = {
  google: {
    url: 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=openid%20email&client_id=281980891262-7nagpvldql6sg5ejlvsecps9gvlsdcqj.apps.googleusercontent.com&redirect_uri=https://api.lol99.kro.kr:8000/google-login',
    logo: googleLogo,
    color: 'bg-gray-900 hover:bg-black',
  },
  kakao: {
    url: 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=a04159cc219d093bdcde9d55ea4b88fc&redirect_uri=https://api.lol99.kro.kr/kakao-login',
    logo: kakaoLogo,
    color: 'bg-gray-900 hover:bg-[#FEE500]',
  },
};
