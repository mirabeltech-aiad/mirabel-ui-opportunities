
import { 
  getContributingContent, 
  getDeploymentContent, 
  getApiContent, 
  getTestingContent, 
  getTroubleshootingContent,
  renderDocumentContent 
} from '../documentationContent';

describe('documentationContent utilities', () => {
  it('returns contributing content', () => {
    const content = getContributingContent();
    expect(content).toContain('Contributing Guidelines');
    expect(content).toContain('Getting Started');
  });

  it('returns deployment content', () => {
    const content = getDeploymentContent();
    expect(content).toContain('Deployment Guide');
    expect(content).toContain('Lovable Platform');
  });

  it('returns API content', () => {
    const content = getApiContent();
    expect(content).toContain('API Documentation');
    expect(content).toContain('Authentication');
  });

  it('returns testing content', () => {
    const content = getTestingContent();
    expect(content).toContain('Testing Guidelines');
    expect(content).toContain('Testing Philosophy');
  });

  it('returns troubleshooting content', () => {
    const content = getTroubleshootingContent();
    expect(content).toContain('Troubleshooting Guide');
    expect(content).toContain('Common Issues');
  });

  it('renders document content correctly', () => {
    const contributingElement = renderDocumentContent('contributing');
    expect(contributingElement.props.children.props.children).toContain('Contributing Guidelines');
    
    const unknownElement = renderDocumentContent('unknown');
    expect(unknownElement.props.children[1].props.children).toContain("This documentation file hasn't been created yet");
  });
});
