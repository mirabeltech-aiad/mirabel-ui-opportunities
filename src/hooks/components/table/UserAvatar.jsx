
import { Avatar, AvatarFallback } from "@OpportunityComponents/ui/avatar";

/**
 * UserAvatar Component
 * 
 * Displays a user avatar with initials and a color-coded background.
 * Automatically generates initials from the user's name and assigns consistent colors.
 * 
 * @param {Object} props - Component props
 * @param {Object|string} props.user - User object with name property or string name
 * @param {string} props.name - Full name of the user (alternative to user object)
 * 
 * @returns {JSX.Element} Avatar component with initials and colored background
 * 
 * @example
 * <UserAvatar user={{ name: "John Doe" }} />
 * // Renders: JD with a consistent color based on the name
 * 
 * <UserAvatar name="John Doe" />
 * // Renders: JD with a consistent color based on the name
 */
const UserAvatar = ({ user, name }) => {
  // Extract name from user object or use name prop directly
  let displayName = name;
  if (user && typeof user === 'object') {
    displayName = user.name || user.displayName || user.fullName;
  } else if (typeof user === 'string') {
    displayName = user;
  }

  // Handle cases where name is undefined, null, or empty
  if (!displayName || typeof displayName !== 'string' || displayName.trim() === '') {
    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-gray-400 text-white text-sm font-medium">
          ?
        </AvatarFallback>
      </Avatar>
    );
  }

  // Trim the name to handle any extra whitespace
  const trimmedName = displayName.trim();

  /**
   * Extract initials from full name
   * For names with spaces, takes first letter of each word
   * For single names, takes first two characters
   */
  let initials = trimmedName;
  if (trimmedName.includes(" ")) {
    // Split name and take first character of each part: "John Doe" -> "JD"
    initials = trimmedName.split(" ").map(part => part[0]).join("");
  }
  
  /**
   * Color assignment based on name for visual consistency
   * Uses character code of first letter to select from predefined color palette
   * Ensures same name always gets same color across sessions
   */
  const colorClasses = [
    "bg-[#1a4d80]", // Primary blue
    "bg-[#4fb3ff]", // Light blue
    "bg-purple-500", 
    "bg-amber-500", 
    "bg-pink-500", 
    "bg-indigo-500", 
    "bg-rose-500", 
    "bg-blue-500"
  ];
  
  // Generate consistent color index based on first character of name
  const colorIndex = trimmedName.charCodeAt(0) % colorClasses.length;
  const bgColorClass = colorClasses[colorIndex];
  
  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback className={`${bgColorClass} text-white text-sm font-medium`}>
        {/* Display first two characters of initials */}
        {initials.substring(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
