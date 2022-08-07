export const mq = (useMediaQuery) => {
    const isMobile = useMediaQuery({ maxWidth: '768px' })
    const isTablet = useMediaQuery({ maxWidth: '1268px' })
    const isDesktop = useMediaQuery({ maxWidth: '1920px' })
  
    if (!isMobile && !isTablet && !isDesktop) return 4
    if (!isMobile && !isTablet && isDesktop) return 3
    if (!isMobile && isTablet && isDesktop) return 2
    if (isMobile && isTablet && isDesktop) return 1
  
}