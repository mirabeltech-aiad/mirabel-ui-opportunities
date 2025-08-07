
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Book, Settings, Key, Activity, Search } from 'lucide-react';
import { FloatingLabelInput } from '../components';

interface HelpSection {
  id: string;
  title: string;
  category: 'getting-started' | 'configuration' | 'troubleshooting' | 'api' | 'deployment';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  tags: string[];
}

const HelpGuide: React.FC = () => {
  const [helpSections] = useState<HelpSection[]>([
    {
      id: '1',
      title: 'Getting Started with Microservices',
      category: 'getting-started',
      difficulty: 'beginner',
      tags: ['microservices', 'architecture', 'setup'],
      content: `# Getting Started with Microservices

## Overview
This platform implements a three-tier microservice architecture designed for scalability and maintainability.

## Architecture Components

### Presentation Layer
- React frontend with TypeScript
- Tailwind CSS for styling
- Responsive design patterns

### Business Logic Layer
- Node.js microservices
- RESTful API endpoints
- Authentication middleware
- Business rule processing

### Data Layer
- MSSQL database cluster
- Connection pooling
- Database migrations
- Backup strategies

## Key Benefits
- **Scalability**: Each service can be scaled independently
- **Maintainability**: Isolated codebases for easier updates
- **Reliability**: Service isolation prevents cascade failures
- **Technology Flexibility**: Different services can use different technologies

## Next Steps
1. Configure your API keys in the Auth Keys section
2. Review the service documentation
3. Set up monitoring and logging
4. Deploy your first microservice`
    },
    {
      id: '2',
      title: 'Configuring API Keys',
      category: 'configuration',
      difficulty: 'beginner',
      tags: ['api-keys', 'authentication', 'security'],
      content: `# Configuring API Keys

## Supported AI Providers
Our platform supports integration with major AI service providers:

### OpenAI
- **GPT-4**: Advanced language model for complex tasks
- **GPT-3.5**: Cost-effective solution for simpler tasks
- **DALL-E**: Image generation capabilities
- **Whisper**: Speech-to-text processing

### Anthropic
- **Claude**: Advanced reasoning and analysis
- **Claude Instant**: Faster responses for real-time applications

### Google
- **Gemini Pro**: Multimodal AI capabilities
- **PaLM**: Large language model for various tasks

## Security Best Practices
1. **Environment Variables**: Store keys securely, never in code
2. **Rotation**: Regularly rotate your API keys
3. **Monitoring**: Track usage and set alerts
4. **Permissions**: Use least-privilege access principles

## Adding New Keys
1. Navigate to the Auth Keys tab
2. Select your AI provider
3. Enter a descriptive name
4. Paste your API key
5. Add usage description
6. Save and test the configuration`
    },
    {
      id: '3',
      title: 'MSSQL Database Configuration',
      category: 'configuration',
      difficulty: 'intermediate',
      tags: ['database', 'mssql', 'configuration'],
      content: `# MSSQL Database Configuration

## Database Setup
Our platform uses Microsoft SQL Server for data persistence with a cluster configuration for high availability.

## Connection Configuration
\`\`\`sql
-- Primary Database Connection
Server: sql-primary-01.internal
Port: 1433
Database: microservices_platform
Authentication: SQL Server Authentication

-- Read Replica Connections
Server: sql-replica-01.internal, sql-replica-02.internal
Port: 1433
Read-Only: true
\`\`\`

## Schema Management
### Migrations
All database changes are managed through migrations:
\`\`\`bash
npm run migrate:up     # Apply new migrations
npm run migrate:down   # Rollback migrations
npm run migrate:status # Check migration status
\`\`\`

### Tables
- **Users**: User account information
- **Services**: Microservice registry
- **ApiKeys**: Encrypted API key storage
- **Logs**: Application and audit logs
- **Configurations**: System settings

## Performance Optimization
1. **Indexing**: Strategic index placement for query optimization
2. **Connection Pooling**: Efficient connection management
3. **Query Optimization**: Regular query performance reviews
4. **Caching**: Redis integration for frequently accessed data

## Backup Strategy
- **Full Backups**: Daily at 2 AM UTC
- **Differential Backups**: Every 6 hours
- **Transaction Log Backups**: Every 15 minutes
- **Retention**: 30 days for full backups, 7 days for differentials`
    },
    {
      id: '4',
      title: 'Service Deployment Guide',
      category: 'deployment',
      difficulty: 'advanced',
      tags: ['deployment', 'docker', 'kubernetes'],
      content: `# Service Deployment Guide

## Docker Deployment
Each microservice is containerized using Docker for consistent deployment across environments.

### Building Services
\`\`\`bash
# Build individual service
docker build -t user-service:latest ./services/user-service

# Build all services
docker-compose build

# Start all services
docker-compose up -d
\`\`\`

### Service Configuration
Each service requires specific environment variables:
\`\`\`yaml
# docker-compose.yml example
version: '3.8'
services:
  user-service:
    build: ./services/user-service
    environment:
      - DB_HOST=mssql
      - DB_PORT=1433
      - DB_NAME=microservices
      - JWT_SECRET=your-secret-key
    ports:
      - "3001:3000"
    depends_on:
      - mssql
      - redis
\`\`\`

## Kubernetes Deployment
For production environments, we recommend Kubernetes for orchestration:

### Namespace Setup
\`\`\`yaml
apiVersion: v1
kind: Namespace
metadata:
  name: microservices-platform
\`\`\`

### Service Deployment
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: microservices-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: host
\`\`\`

## Health Checks
Implement health check endpoints for monitoring:
\`\`\`javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
\`\`\``
    },
    {
      id: '5',
      title: 'Troubleshooting Common Issues',
      category: 'troubleshooting',
      difficulty: 'intermediate',
      tags: ['troubleshooting', 'debugging', 'monitoring'],
      content: `# Troubleshooting Common Issues

## Service Connection Issues

### Problem: Service not responding
**Symptoms**: HTTP 500 errors, timeouts, connection refused
**Solutions**:
1. Check service health endpoint: \`curl http://service:3000/health\`
2. Verify environment variables are set correctly
3. Check database connectivity
4. Review service logs: \`docker logs service-name\`

### Problem: Database connection failures
**Symptoms**: Cannot connect to database, authentication errors
**Solutions**:
1. Verify MSSQL server is running
2. Check connection string format
3. Validate credentials and permissions
4. Test network connectivity: \`telnet db-host 1433\`

## Performance Issues

### Problem: High CPU usage
**Indicators**: CPU usage > 80%, slow response times
**Solutions**:
1. Identify resource-intensive operations
2. Implement caching for frequent queries
3. Optimize database queries
4. Scale service horizontally

### Problem: Memory leaks
**Indicators**: Gradually increasing memory usage
**Solutions**:
1. Monitor memory patterns over time
2. Review code for unclosed connections
3. Implement proper cleanup in event handlers
4. Use memory profiling tools

## API Integration Issues

### Problem: API key authentication failures
**Symptoms**: 401 Unauthorized, API rate limits exceeded
**Solutions**:
1. Verify API key is correctly configured
2. Check key permissions and quotas
3. Implement proper rate limiting
4. Use exponential backoff for retries

### Problem: Rate limiting
**Solutions**:
1. Implement request queuing
2. Use multiple API keys for load distribution
3. Cache responses when possible
4. Monitor usage patterns

## Monitoring and Alerting
Set up proper monitoring to catch issues early:
1. **Service Health**: Regular health check pings
2. **Resource Usage**: CPU, memory, disk monitoring
3. **Error Rates**: Track 4xx and 5xx HTTP responses
4. **Response Times**: Monitor API latency
5. **Database Performance**: Query execution times`
    }
  ]);

  const [selectedSection, setSelectedSection] = useState<HelpSection | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'configuration', label: 'Configuration' },
    { id: 'troubleshooting', label: 'Troubleshooting' },
    { id: 'api', label: 'API Reference' },
    { id: 'deployment', label: 'Deployment' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started': return <Book className="w-4 h-4" />;
      case 'configuration': return <Settings className="w-4 h-4" />;
      case 'troubleshooting': return <Info className="w-4 h-4" />;
      case 'api': return <Key className="w-4 h-4" />;
      case 'deployment': return <Activity className="w-4 h-4" />;
      default: return <Book className="w-4 h-4" />;
    }
  };

  const filteredSections = helpSections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-ocean-800">
            <Info className="w-5 h-5 mr-2" />
            Help & Documentation
          </CardTitle>
          <CardDescription>Comprehensive guides for platform features and troubleshooting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FloatingLabelInput
              label="Search Help Topics"
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search guides, tutorials, and documentation..."
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-ocean-500 focus:outline-none transition-all duration-200"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Help Topics</h3>
              {filteredSections.map((section) => (
                <div
                  key={section.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedSection?.id === section.id
                      ? 'border-ocean-500 bg-ocean-50'
                      : 'border-gray-200 bg-white hover:border-ocean-300'
                  }`}
                  onClick={() => setSelectedSection(section)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 pr-2">{section.title}</h4>
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon(section.category)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={`${getDifficultyColor(section.difficulty)} text-white text-xs`}>
                      {section.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {section.category}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {section.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              {selectedSection ? (
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-ocean-800">
                        {getCategoryIcon(selectedSection.category)}
                        <span className="ml-2">{selectedSection.title}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getDifficultyColor(selectedSection.difficulty)} text-white`}>
                          {selectedSection.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {selectedSection.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSection.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                        {selectedSection.content}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center">
                    <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Help Topic</h3>
                    <p className="text-gray-600">Choose a topic from the list to view detailed documentation</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpGuide;
