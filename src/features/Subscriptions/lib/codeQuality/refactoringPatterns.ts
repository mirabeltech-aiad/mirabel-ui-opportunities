/**
 * @fileoverview Refactoring Patterns for Single Responsibility
 * 
 * Examples and patterns for extracting responsibilities into focused components
 */

// Refactoring patterns for single responsibility
export const REFACTORING_PATTERNS = {
  // Extract custom hooks for complex state logic
  customHook: {
    pattern: 'Extract state management and effects into custom hooks',
    example: `
// Before: Component doing everything
const MyComponent = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  
  return <div>{data}</div>;
};

// After: Extracted hook
const useData = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  
  return { data, loading };
};

const MyComponent = () => {
  const { data, loading } = useData();
  return <div>{data}</div>;
};
    `,
  },

  // Extract presentation components
  presentationComponent: {
    pattern: 'Separate container and presentation components',
    example: `
// Before: Mixed logic and presentation
const UserList = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

// After: Separated concerns
const UserListContainer = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);
  
  return <UserListPresentation users={users} />;
};

const UserListPresentation = ({ users }) => (
  <div>
    {users.map(user => (
      <UserCard key={user.id} user={user} />
    ))}
  </div>
);
    `,
  },

  // Extract service layers
  serviceLayer: {
    pattern: 'Move business logic to service layers',
    example: `
// Before: Business logic in component
const OrderComponent = () => {
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      const tax = itemTotal * 0.1;
      return sum + itemTotal + tax;
    }, 0);
  };
  
  return <div>Total: {calculateTotal(items)}</div>;
};

// After: Business logic in service
class OrderService {
  static calculateTotal(items) {
    return items.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      const tax = itemTotal * 0.1;
      return sum + itemTotal + tax;
    }, 0);
  }
}

const OrderComponent = ({ items }) => {
  const total = OrderService.calculateTotal(items);
  return <div>Total: {total}</div>;
};
    `,
  },
} as const;