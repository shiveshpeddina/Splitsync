import { getAvatarById } from './AvatarPicker';

const Avatar = ({ name, src, avatar, size = 40, className = '' }) => {
  // If avatar ID is provided, render the emoji face
  const avatarData = avatar ? getAvatarById(avatar) : null;

  if (avatarData) {
    return (
      <div
        className={`avatar ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${avatarData.bg}, ${avatarData.bg}dd)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.5,
          flexShrink: 0,
          boxShadow: `0 2px 8px ${avatarData.bg}30`,
        }}
        title={name}
      >
        {avatarData.face}
      </div>
    );
  }

  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  // Generate a consistent color from name
  const hue = name
    ? name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
    : 200;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`avatar ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
    );
  }

  return (
    <div
      className={`avatar ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `hsl(${hue}, 60%, 45%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.38,
        fontWeight: 700,
        color: 'white',
        flexShrink: 0,
        letterSpacing: '0.5px',
      }}
      title={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;
