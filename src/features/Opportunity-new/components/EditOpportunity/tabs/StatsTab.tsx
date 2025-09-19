import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Clock 
} from 'lucide-react';
import axiosService from '@/services/axiosService.js';

interface StatsTabProps {
  opportunityId?: string;
}

interface OpportunityStats {
  communicationStats: {
    totalCalls: number;
    totalEmails: number;
    totalMeetings: number;
    totalTouchpoints: number;
  };
  timeAnalytics: {
    daysUntilClose: number;
    timeInCurrentStage: number;
    totalTimeInPipeline: number;
    averageResponseTime: number;
  };
  stageMetrics: {
    averageStageTime: number;
    longestStage: string;
    longestStageDays: number;
    processVelocity: number;
  };
  contactMetrics: {
    totalContacts: number;
    primaryContact: string;
    lastContactDate: string;
    proposalToContactRatio: number;
  };
  insights: {
    riskFactors: string[];
    recommendations: string[];
    competitivePosition: string;
  };
}

const StatsTab: React.FC<StatsTabProps> = ({
  opportunityId
}) => {
  const [stats, setStats] = useState<OpportunityStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load opportunity statistics
  const loadStats = async () => {
    if (!opportunityId) return;

    setIsLoading(true);
    try {
      const response = await axiosService.get(`/services/Opportunities/Stats/${opportunityId}`);
      if (response?.content) {
        setStats(response.content);
      } else {
        // Mock data for demonstration
        setStats({
          communicationStats: {
            totalCalls: 12,
            totalEmails: 28,
            totalMeetings: 5,
            totalTouchpoints: 45
          },
          timeAnalytics: {
            daysUntilClose: 45,
            timeInCurrentStage: 12,
            totalTimeInPipeline: 89,
            averageResponseTime: 2.5
          },
          stageMetrics: {
            averageStageTime: 18,
            longestStage: 'Proposal',
            longestStageDays: 32,
            processVelocity: 1.2
          },
          contactMetrics: {
            totalContacts: 8,
            primaryContact: 'John Smith',
            lastContactDate: '2024-01-15',
            proposalToContactRatio: 0.6
          },
          insights: {
            riskFactors: [
              'Extended time in current stage',
              'Below average communication frequency',
              'Approaching projected close date'
            ],
            recommendations: [
              'Schedule follow-up meeting within 3 days',
              'Send proposal summary to decision makers',
              'Identify and address potential objections'
            ],
            competitivePosition: 'Strong - leading proposal with good relationship'
          }
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [opportunityId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading statistics...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-500">
        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p>No statistics available.</p>
        <p className="text-sm mt-1">Statistics will be generated once there is activity data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Communication Statistics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
          Communication Statistics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Phone className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-blue-600">{stats.communicationStats.totalCalls}</p>
            <p className="text-sm text-gray-600">Total Calls</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Mail className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-600">{stats.communicationStats.totalEmails}</p>
            <p className="text-sm text-gray-600">Total Emails</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold text-purple-600">{stats.communicationStats.totalMeetings}</p>
            <p className="text-sm text-gray-600">Meetings</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <p className="text-2xl font-bold text-orange-600">{stats.communicationStats.totalTouchpoints}</p>
            <p className="text-sm text-gray-600">Total Touchpoints</p>
          </div>
        </div>
      </div>

      {/* Time Analytics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          Time Analytics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-red-600" />
            <p className="text-2xl font-bold text-red-600">{stats.timeAnalytics.daysUntilClose}</p>
            <p className="text-sm text-gray-600">Days Until Close</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-blue-600">{stats.timeAnalytics.timeInCurrentStage}</p>
            <p className="text-sm text-gray-600">Days in Current Stage</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-600">{stats.timeAnalytics.totalTimeInPipeline}</p>
            <p className="text-sm text-gray-600">Total Pipeline Days</p>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
            <p className="text-2xl font-bold text-yellow-600">{stats.timeAnalytics.averageResponseTime}</p>
            <p className="text-sm text-gray-600">Avg Response (days)</p>
          </div>
        </div>
      </div>

      {/* Stage Metrics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          Stage Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Average Stage Time</span>
              <span className="text-lg font-bold text-blue-600">{stats.stageMetrics.averageStageTime} days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min((stats.stageMetrics.averageStageTime / 30) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Process Velocity</span>
              <span className="text-lg font-bold text-green-600">{stats.stageMetrics.processVelocity}x</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${Math.min(stats.stageMetrics.processVelocity * 50, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
          <p className="text-sm font-medium text-orange-900">Longest Stage</p>
          <p className="text-lg font-bold text-orange-700">
            {stats.stageMetrics.longestStage} ({stats.stageMetrics.longestStageDays} days)
          </p>
        </div>
      </div>

      {/* Contact Metrics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          Contact Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Contacts</span>
              <span className="text-lg font-bold text-blue-600">{stats.contactMetrics.totalContacts}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Primary Contact</span>
              <span className="text-sm text-gray-900">{stats.contactMetrics.primaryContact}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Last Contact</span>
              <span className="text-sm text-gray-900">
                {new Date(stats.contactMetrics.lastContactDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Proposal Ratio</span>
              <span className="text-lg font-bold text-green-600">
                {(stats.contactMetrics.proposalToContactRatio * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Factors */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-red-700 mb-4">Risk Factors</h3>
          <ul className="space-y-2">
            {stats.insights.riskFactors.map((risk, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-sm text-gray-700">{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-green-700 mb-4">Recommendations</h3>
          <ul className="space-y-2">
            {stats.insights.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-sm text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Competitive Position */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitive Position</h3>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-900 font-medium">{stats.insights.competitivePosition}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;