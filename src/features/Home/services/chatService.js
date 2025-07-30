import { getSessionValue } from '../../../utils/sessionHelpers';
import { 
  API_FRONTCHAT_CONFIG, 
  API_FRONTCHAT_HMAC, 
  API_FRONTCHAT_INIT 
} from '../../../config/apiUrls';
import httpClient from '../../../services/httpClient';

/**
 * Chat service for Front Chat integration
 * Uses secure backend API endpoints for configuration and HMAC generation
 * Matches the backend logic for Front Chat initialization and HMAC authentication
 */
export const chatService = {
  /**
   * Get Front Chat configuration from secure backend API
   * @returns {Promise<Object>} Front Chat configuration
   */
  async getFrontChatConfig() {
    try {
      const data = await httpClient.get(API_FRONTCHAT_CONFIG);
      return data.content || data;
    } catch (error) {
      console.error('Failed to get Front Chat config:', error);
      // Fallback to environment variable if API fails
      return { 
        chatId: import.meta.env.REACT_APP_FRONT_CHAT_ID || '18e215377facefd562516d3688f3fa6a' 
      };
    }
  },

  /**
   * Get HMAC hash from secure backend API
   * @param {string} email - User email
   * @returns {Promise<string>} HMAC hash
   */
  async generateHMAC(email) {
    try {
      const data = await httpClient.get(API_FRONTCHAT_HMAC, { email });
      return data.content?.userHash || data.userHash || '';
    } catch (error) {
      console.error('Failed to generate HMAC:', error);
      return '';
    }
  },

  /**
   * Get complete Front Chat initialization data from backend
   * @returns {Promise<Object>} Complete initialization data
   */
  async getFrontChatInitData() {
    try {
      const data = await httpClient.get(API_FRONTCHAT_INIT);
      return data.content || data;
    } catch (error) {
      console.error('Failed to get Front Chat init data:', error);
      return null;
    }
  },

  /**
   * Initialize Front Chat with secure backend data
   * Matches backend initialization: window.FrontChat('init', {...})
   */
  async initializeFrontChat() {
    try {
      // Try to get complete initialization data from backend first
      let initData = await chatService.getFrontChatInitData();
      
      if (!initData) {
        // Fallback to manual data gathering if backend fails
        const config = await chatService.getFrontChatConfig();
        const userEmail = getSessionValue('Email') || '';
        const userName = getSessionValue('FullName') || getSessionValue('UserName') || '';
        const companyName = getSessionValue('CompanyName') || '';
        const userHash = await chatService.generateHMAC(userEmail);

        initData = {
          chatId: config.chatId,
          email: userEmail,
          userHash: userHash,
          name: userName,
          customFields: { Title: companyName }
        };
      }



      // Check if Front Chat is available
      if (typeof window.FrontChat === 'undefined') {
        chatService.loadFrontChatScript();
        return;
      }

      // Try initialization with full user data first
      try {
        window.FrontChat('init', {
          chatId: initData.chatId,
          useDefaultLauncher: false,
          email: initData.email,
          userHash: initData.userHash,
          name: initData.name,
          customFields: initData.customFields,
                  onInitCompleted: () => {
          // Set up window visibility change handler
          window.FrontChat('onWindowVisibilityChanged', function (e) {
            if (e.is_window_visible) {
              chatService.makeChatBoxDraggable();
            }
          });
        },
                  onError: (error) => {
          // Try fallback initialization without user data
          chatService.initializeFrontChatFallback(initData.chatId);
        }
        });
      } catch (initError) {
        chatService.initializeFrontChatFallback(initData.chatId);
      }

    } catch (error) {
      console.error('❌ Error initializing Front Chat:', error);
    }
  },

  /**
   * Fallback Front Chat initialization without user data
   * Used when the main initialization fails due to conversation ID issues
   */
  initializeFrontChatFallback(chatId) {
    try {
      window.FrontChat('init', {
        chatId: chatId,
        useDefaultLauncher: false,
        onInitCompleted: () => {
          // Set up window visibility change handler
          window.FrontChat('onWindowVisibilityChanged', function (e) {
            if (e.is_window_visible) {
              chatService.makeChatBoxDraggable();
            }
          });
        }
      });
    } catch (error) {
      console.error('Front Chat fallback initialization failed:', error);
    }
  },

  /**
   * Load Front Chat script dynamically
   */
  loadFrontChatScript: () => {
    if (document.querySelector('script[src*="chat-assets.frontapp.com"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://chat-assets.frontapp.com/v1/chat.bundle.js';
    script.async = true;
    script.onload = () => {
      // Initialize after script loads
      setTimeout(() => {
        chatService.initializeFrontChat();
      }, 1000);
    };
    script.onerror = () => {
      console.error('Failed to load Front Chat script');
    };
    document.head.appendChild(script);
  },

  /**
   * Show Front Chat (matches backend showChat function)
   */
  showChat: () => {
    try {
      if (typeof window.FrontChat === 'undefined') {
        chatService.initializeFrontChat();
        return;
      }

      window.FrontChat('show');
    } catch (error) {
      console.error('Error showing Front Chat:', error);
    }
  },

  /**
   * Make Front Chat box draggable (matches backend makeChatBoxDraggable function)
   */
  makeChatBoxDraggable: () => {
    try {
      const chatbox = document.getElementById('front-chat-iframe');
      if (!chatbox) {
        setTimeout(() => chatService.makeChatBoxDraggable(), 1000);
        return;
      }

      const header = chatbox.contentDocument?.getElementsByClassName('fc-3_a5O')?.[0];
      if (!header) {
        setTimeout(() => chatService.makeChatBoxDraggable(), 1000);
        return;
      }

      const backdropEl = document.getElementById("frontChatDragBackdropEl");
      let initialX, initialY, moveElement = false;

      function moveChatBox(data) {
        const chatboxRect = chatbox.getBoundingClientRect();
        let x = data.x + chatboxRect.left, y = data.y + chatboxRect.top;

        if (data.mouseDown) {
          initialX = x;
          initialY = y;
        } else if (data.mouseMove) {
          let newTop = chatbox.offsetTop - (initialY - y);
          let newLeft = chatbox.offsetLeft - (initialX - x);

          // Ensure the chatbox stays within the viewport
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const chatboxWidth = chatboxRect.width;
          const chatboxHeight = chatboxRect.height;

          if (newLeft < 0) {
            newLeft = 0;
          } else if (newLeft + chatboxWidth > viewportWidth) {
            newLeft = viewportWidth - chatboxWidth;
          }

          if (newTop < 0) {
            newTop = 0;
          } else if (newTop + chatboxHeight > viewportHeight) {
            newTop = viewportHeight - chatboxHeight;
          }

          chatbox.style.top = newTop + 'px';
          chatbox.style.left = newLeft + 'px';

          initialX = x;
          initialY = y;
        }
      }

      function handleMouseDown(e) {
        e.preventDefault();
        moveElement = true;
        moveChatBox({
          mouseDown: true,
          x: e.clientX,
          y: e.clientY
        });
        document.addEventListener('mouseup', handleMouseUp);
        chatbox.contentDocument.addEventListener('mouseup', handleMouseUp);
        header.addEventListener('mouseleave', handleMouseLeave);
        header.addEventListener('mousemove', handleMouseMove);
      }

      function handleMouseMove(e) {
        if (moveElement) {
          if (backdropEl) backdropEl.style.display = "block";
          moveChatBox({
            mouseMove: true,
            x: e.clientX,
            y: e.clientY
          });
        }
      }

      function handleMouseUp(e) {
        moveElement = false;
        if (backdropEl) backdropEl.style.display = "none";
        document.removeEventListener('mouseup', handleMouseUp);
        chatbox.contentDocument.removeEventListener('mouseup', handleMouseUp);
        header.removeEventListener('mouseleave', handleMouseLeave);
        header.removeEventListener('mousemove', handleMouseMove);
      }

      function handleMouseLeave(e) {
        if (moveElement) {
          moveChatBox({
            mouseMove: true,
            x: e.clientX,
            y: e.clientY
          });
        }
      }

      header.addEventListener('mousedown', handleMouseDown);
    } catch (error) {
      console.error('Error making Front Chat draggable:', error);
    }
  }
}; 