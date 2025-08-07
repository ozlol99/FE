import { OAUTH_CONFIG, createOauthUrl } from '@/utils/oauthConfig';
import SocialButton from '@/components/SocialButton';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#181818]">
      <div className="w-full max-w-xs flex flex-col items-center">
        <h2 className="text-white text-2xl mb-3 font-semibold tracking-widest">
          로그인
        </h2>
        <p className="text-gray-400 text-xs mb-8 font-bold tracking-widest">
          함께 플레이할 준비 되셨나요?
        </p>
        <div className="w-2/3 border-b border-gray-700 mb-8" />
        <div className="flex gap-8 w-full justify-center">
          {Object.keys(OAUTH_CONFIG).map((provider) => (
            <SocialButton
              key={provider}
              href={createOauthUrl(provider)}
              logo={OAUTH_CONFIG[provider].logo}
              color={OAUTH_CONFIG[provider].color}
              title={provider + ' 로그인'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
