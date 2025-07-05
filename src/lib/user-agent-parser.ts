/**
 * Simple user agent parser for session management
 */

/**
 * Device information extracted from a user agent string
 */
export interface DeviceInfo {
  browser: string;
  browserVersion?: string;
  os: string;
  osVersion?: string;
  device: string;
  isDesktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
}

/**
 * Parse a user agent string into device information
 * @param userAgent - The user agent string to parse
 * @returns An object containing device information
 */
export function parseUserAgent(userAgent: string | undefined | null): DeviceInfo {
  // Default values
  const result: DeviceInfo = {
    browser: "Unknown",
    os: "Unknown",
    device: "Unknown",
    isDesktop: false,
    isMobile: false,
    isTablet: false,
  };

  if (!userAgent) {
    return result;
  }

  // Normalize user agent string
  const ua = userAgent.toLowerCase();

  // Detect browser
  if (ua.includes("firefox")) {
    result.browser = "Firefox";
    const match = ua.match(/firefox\/([\d.]+)/);
    result.browserVersion = match?.[1];
  } else if (ua.includes("edg")) {
    result.browser = "Edge";
    const match = ua.match(/edg\/([\d.]+)/);
    result.browserVersion = match?.[1];
  } else if (ua.includes("chrome")) {
    result.browser = "Chrome";
    const match = ua.match(/chrome\/([\d.]+)/);
    result.browserVersion = match?.[1];
  } else if (ua.includes("safari") && !ua.includes("chrome")) {
    result.browser = "Safari";
    const match = ua.match(/version\/([\d.]+)/);
    result.browserVersion = match?.[1];
  } else if (ua.includes("msie") || ua.includes("trident")) {
    result.browser = "Internet Explorer";
    const match = ua.match(/(?:msie |rv:)([\d.]+)/);
    result.browserVersion = match?.[1];
  } else if (ua.includes("opera") || ua.includes("opr")) {
    result.browser = "Opera";
    const match = ua.match(/(?:opera|opr)\/([\d.]+)/);
    result.browserVersion = match?.[1];
  }

  // Detect OS
  if (ua.includes("windows")) {
    result.os = "Windows";
    if (ua.includes("windows nt 10")) result.osVersion = "10";
    else if (ua.includes("windows nt 6.3")) result.osVersion = "8.1";
    else if (ua.includes("windows nt 6.2")) result.osVersion = "8";
    else if (ua.includes("windows nt 6.1")) result.osVersion = "7";
  } else if (ua.includes("macintosh") || ua.includes("mac os x")) {
    result.os = "macOS";
    const match = ua.match(/mac os x ([\d_.]+)/);
    if (match) {
      result.osVersion = match[1].replace(/_/g, ".");
    }
  } else if (ua.includes("android")) {
    result.os = "Android";
    const match = ua.match(/android ([\d.]+)/);
    result.osVersion = match?.[1];
  } else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
    result.os = "iOS";
    const match = ua.match(/os ([\d_]+)/);
    if (match) {
      result.osVersion = match[1].replace(/_/g, ".");
    }
  } else if (ua.includes("linux")) {
    result.os = "Linux";
  }

  // Detect device type
  if (
    ua.includes("mobile") ||
    ua.includes("iphone") ||
    ua.includes("ipod") ||
    (ua.includes("android") && !ua.includes("tablet"))
  ) {
    result.device = result.os;
    result.isMobile = true;
  } else if (
    ua.includes("tablet") ||
    ua.includes("ipad") ||
    (ua.includes("android") && ua.includes("tablet"))
  ) {
    result.device = `${result.os} Tablet`;
    result.isTablet = true;
  } else {
    result.device = "Desktop";
    result.isDesktop = true;
  }

  return result;
}

/**
 * Format device info into a human-readable string
 * @param deviceInfo - The device information object
 * @returns A formatted string like "Chrome on Windows" or "Safari on iPhone"
 */
export function formatDeviceInfo(deviceInfo: DeviceInfo): string {
  const browser = deviceInfo.browserVersion
    ? `${deviceInfo.browser} ${deviceInfo.browserVersion}`
    : deviceInfo.browser;

  const os =
    deviceInfo.osVersion && deviceInfo.os !== "Unknown"
      ? `${deviceInfo.os} ${deviceInfo.osVersion}`
      : deviceInfo.os;

  return `${browser} on ${deviceInfo.isMobile || deviceInfo.isTablet ? deviceInfo.device : os}`;
}
