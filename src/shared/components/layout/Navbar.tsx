import React, { useState, useCallback, useMemo, useEffect, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Waves,
  FileText,
  Settings,
  ChevronDown,
  User,
  Bell,
  Search,
  Menu,
  X,
  CalendarDays,
  FolderOpen,
  Palette,
  Clock,
  DollarSign,
  Upload,
  BarChart,
  Calculator,
  CreditCard,
  Globe,
  TrendingUp,
  Info
} from 'lucide-react'
import { logNavbarDiagnostics } from '../../utils/navbarDiagnostics'

// Memoized dropdown item component to prevent unnecessary re-renders
const DropdownItem = memo(({ 
  item, 
  isActive, 
  onClose 
}: { 
  item: any, 
  isActive: boolean, 
  onClose: () => void 
}) => (
  <Link
    to={item.path}
    onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      onClose()
      // Use native navigation to ensure it works
      window.location.href = item.path
    }}
    className={`flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors ${
      isActive
        ? 'text-ocean-700 bg-ocean-50'
        : 'text-gray-900'
    }`}
  >
    <item.icon className="h-4 w-4 flex-shrink-0" />
    <div className="flex flex-col">
      <span className="text-sm font-medium">{item.label}</span>
      <span className="text-xs text-muted-foreground">{item.description}</span>
    </div>
  </Link>
))

// Memoized navigation link component
const NavLink = memo(({ 
  to, 
  isActive, 
  children, 
  onClick 
}: { 
  to: string, 
  isActive: boolean, 
  children: React.ReactNode,
  onClick?: () => void 
}) => (
  <Link
    to={to}
    onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      onClick?.()
      // Use native navigation for better reliability
      window.location.href = to
    }}
    className={`flex items-center space-x-1 px-3 py-2 rounded-sm text-sm font-medium transition-colors ${
      isActive
        ? 'bg-white/20 text-white'
        : 'text-blue-100 hover:bg-white/10 hover:text-white'
    }`}
  >
    {children}
  </Link>
))

const Navbar: React.FC = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Memoize active path check to prevent unnecessary re-renders
  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname])

  // Memoize dropdown active state
  const isDropdownActive = useCallback((dropdown: string) => {
    if (dropdown === 'timetracking') {
      return isActive('/time-tracking') || isActive('/billing-reports') || isActive('/zoom-import') || isActive('/calendar-import') || isActive('/analytics')
    }
    if (dropdown === 'rateanalyzer') {
      return isActive('/rate-analyzer') || isActive('/rate-consolidation-analyzer')
    }
    if (dropdown === 'admin') {
      return isActive('/products') || isActive('/rate-cards') || isActive('/product-schedules') || isActive('/component-library')
    }
    return false
  }, [isActive])

  // Optimize dropdown toggle with useCallback and debouncing
  const toggleDropdown = useCallback((dropdown: string) => {
    setActiveDropdown(prev => {
      const newValue = prev === dropdown ? null : dropdown
      return newValue
    })
  }, [])

  // Close dropdowns when route changes
  useEffect(() => {
    setActiveDropdown(null)
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Close mobile menu and dropdowns on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null)
        setIsMobileMenuOpen(false)
      }
    }
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('.navbar-dropdown') && !target.closest('.navbar-dropdown-trigger')) {
        setActiveDropdown(null)
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    document.addEventListener('click', handleClickOutside)
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  // Run diagnostics in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      const timer = setTimeout(logNavbarDiagnostics, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Memoize navigation items to prevent recreation on every render
  const navigationItems = useMemo(() => [
    {
      label: 'Time Tracking',
      icon: Clock,
      dropdown: 'timetracking',
      items: [
       
        { 
          label: 'Time Entry Presets', 
          description: 'Manage reusable presets for quick entries',
          path: '/time-tracking/presets', 
          icon: FileText 
        },
        { 
          label: 'Billing Reports', 
          description: 'Generate comprehensive billing reports',
          path: '/billing-reports', 
          icon: DollarSign 
        },
        { 
          label: 'Zoom Import', 
          description: 'Import Zoom meeting data as time entries',
          path: '/zoom-import', 
          icon: Upload 
        },
        { 
          label: 'Calendar Import', 
          description: 'Import calendar events as time entries',
          path: '/calendar-import', 
          icon: CalendarDays 
        },
        { 
          label: 'Analytics', 
          description: 'View time tracking analytics and performance metrics',
          path: '/analytics', 
          icon: BarChart 
        },
      ]
    },
    {
      label: 'Rate Analyzer',
      icon: Calculator,
      dropdown: 'rateanalyzer',
      items: [
        {
          label: 'Rate Analyzer',
          description: 'Analyze and optimize pricing strategies',
          path: '/rate-analyzer',
          icon: Calculator
        },
        {
          label: 'Rate Consolidation Analyzer',
          description: 'Analyze rate card consolidation opportunities with financial impact',
          path: '/rate-consolidation-analyzer',
          icon: TrendingUp
        }
      ]
    },
    {
      label: 'Admin',
      icon: Settings,
      dropdown: 'admin',
      items: [
        {
          label: 'Products',
          description: 'Manage products, categories, and product information',
          path: '/products',
          icon: FolderOpen
        },
        {
          label: 'Rate Cards',
          description: 'Manage pricing information for digital and print products',
          path: '/rate-cards',
          icon: CreditCard
        },

        
        {
          label: 'Schedules',
          description: 'Manage product scheduling and publication calendar',
          path: '/product-schedules',
          icon: CalendarDays
        },

        { 
          label: 'Component Library', 
          description: 'Complete inventory of all shared components',
          path: '/component-library', 
          icon: FolderOpen 
        },
      ]
    }
  ], [])

  // Memoized close handlers
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), [])
  const closeDropdown = useCallback(() => setActiveDropdown(null), [])

  return (
    <nav className="bg-ocean-gradient h-14 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo/Brand Section */}
          <div className="flex items-center space-x-3">
            <Link 
              to="/" 
              onClick={(e) => {
                e.preventDefault()
                window.location.href = '/'
              }}
              className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors"
            >
              <Waves className="h-6 w-6" />
              <span className="font-bold text-lg hidden sm:block">Magazine Manager Kiro</span>
              <span className="font-bold text-lg sm:hidden">MMK</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Rate Analyzer and Time Tracking Dropdowns */}
            {navigationItems.filter(item => item.dropdown === 'rateanalyzer' || item.dropdown === 'timetracking').map((item) => (
              <div key={item.label} className="relative navbar-dropdown">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleDropdown(item.dropdown)
                  }}
                  className={`navbar-dropdown-trigger flex items-center space-x-1 px-3 py-2 rounded-sm text-sm font-medium transition-colors ${
                    activeDropdown === item.dropdown || isDropdownActive(item.dropdown)
                      ? 'bg-white/20 text-white'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  <ChevronDown 
                    className={`h-3 w-3 transition-transform ${
                      activeDropdown === item.dropdown ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === item.dropdown && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    {item.items.map((dropdownItem) => (
                      <DropdownItem
                        key={dropdownItem.path}
                        item={dropdownItem}
                        isActive={isActive(dropdownItem.path)}
                        onClose={closeDropdown}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <button className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-sm transition-colors">
              <Search className="h-4 w-4" />
            </button>

            {/* Notifications */}
            <button className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-sm transition-colors relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-sm transition-colors">
              <Settings className="h-4 w-4" />
            </button>

            {/* Admin Dropdown - Moved to far right */}
            {navigationItems.filter(item => item.dropdown === 'admin').map((item) => (
              <div key={item.label} className="relative navbar-dropdown">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleDropdown(item.dropdown)
                  }}
                  className={`navbar-dropdown-trigger flex items-center space-x-1 px-3 py-2 rounded-sm text-sm font-medium transition-colors ${
                    activeDropdown === item.dropdown || isDropdownActive(item.dropdown)
                      ? 'bg-white/20 text-white'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  <ChevronDown 
                    className={`h-3 w-3 transition-transform ${
                      activeDropdown === item.dropdown ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Dropdown Menu - Positioned to the right */}
                {activeDropdown === item.dropdown && (
                  <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    {item.items.map((dropdownItem) => (
                      <DropdownItem
                        key={dropdownItem.path}
                        item={dropdownItem}
                        isActive={isActive(dropdownItem.path)}
                        onClose={closeDropdown}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* User Profile */}
            <div className="relative navbar-dropdown">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleDropdown('profile')
                }}
                className={`navbar-dropdown-trigger flex items-center space-x-2 px-3 py-2 rounded-sm transition-colors ${
                  activeDropdown === 'profile'
                    ? 'bg-white/20 text-white'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden sm:block text-sm">John Doe</span>
                <ChevronDown 
                  className={`h-3 w-3 transition-transform ${
                    activeDropdown === 'profile' ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Profile Dropdown */}
              {activeDropdown === 'profile' && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    to="/profile"
                    onClick={(e) => {
                      e.preventDefault()
                      closeDropdown()
                      window.location.href = '/profile'
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={(e) => {
                      e.preventDefault()
                      closeDropdown()
                      window.location.href = '/settings'
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <hr className="my-1" />
                  <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left">
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }}
              className="md:hidden p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-14 left-0 right-0 bg-ocean-gradient border-t border-white/20">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleDropdown(item.dropdown)
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-sm transition-colors ${
                      activeDropdown === item.dropdown || isDropdownActive(item.dropdown)
                        ? 'bg-white/20 text-white'
                        : 'text-blue-100 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown 
                      className={`h-3 w-3 transition-transform ${
                        activeDropdown === item.dropdown ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {activeDropdown === item.dropdown && (
                    <div className="ml-6 space-y-1">
                      {item.items.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.path}
                          to={dropdownItem.path}
                          onClick={(e) => {
                            e.preventDefault()
                            setActiveDropdown(null)
                            setIsMobileMenuOpen(false)
                            window.location.href = dropdownItem.path
                          }}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-sm transition-colors ${
                            isActive(dropdownItem.path)
                              ? 'bg-white/20 text-white'
                              : 'text-blue-100 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <dropdownItem.icon className="h-4 w-4 flex-shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{dropdownItem.label}</span>
                            <span className="text-xs opacity-75">{dropdownItem.description}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar