import { useEffect, useState } from 'react'

interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouchDevice: boolean
}

/**
 * 디바이스 타입을 감지하는 훅
 * - User Agent와 터치 지원 여부를 조합하여 정확한 감지
 * - 모바일/태블릿/데스크톱 구분
 */
export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
  })

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      const mobilePatterns = [
        /android.*mobile/,
        /iphone/,
        /ipod/,
        /blackberry/,
        /windows phone/,
        /opera mini/,
        /mobile/,
      ]

      const tabletPatterns = [/ipad/, /android(?!.*mobile)/, /tablet/, /kindle/, /silk/, /playbook/]

      const isMobile = mobilePatterns.some((pattern) => pattern.test(userAgent))
      const isTablet = tabletPatterns.some((pattern) => pattern.test(userAgent))
      const isDesktop = !isMobile && !isTablet

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
      })
    }

    detectDevice()

    const handleResize = () => {
      detectDevice()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return deviceInfo
}
