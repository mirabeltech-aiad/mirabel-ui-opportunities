
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@OpportunityComponents/ui/card";
import { Badge } from "@OpportunityComponents/ui/badge";
import { Progress } from "@OpportunityComponents/ui/progress";
import { Avatar, AvatarFallback } from "@OpportunityComponents/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@OpportunityComponents/ui/table";
import { Users, TrendingUp, DollarSign, Target, Award } from "lucide-react";

const TeamPerformanceTable = ({ data }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Ahead":
        return "green";
      case "On Track":
        return "blue";
      case "At Risk":
        return "red";
      default:
        return "gray";
    }
  };

  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name) => {
    // Generate consistent color based on name
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-ocean-800 flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" />
          Team Performance Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-gray-50 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Rep
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-600" />
                  Deals
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Revenue
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  Quota Progress
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  Win Rate
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  Avg Deal Size
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((rep) => {
              const quotaProgress = (rep.revenue / rep.quota) * 100;
              const initials = getUserInitials(rep.name);
              const avatarColor = getAvatarColor(rep.name);
              
              return (
                <TableRow key={rep.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className={`h-8 w-8 ${avatarColor}`}>
                        <AvatarFallback className="text-white text-xs font-medium">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-black">{rep.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">{rep.deals}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-green-600">
                      ${(rep.revenue / 1000000).toFixed(1)}M
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3 text-purple-500" />
                          <span className="font-medium text-purple-600">{quotaProgress.toFixed(0)}%</span>
                        </div>
                        <span className="text-muted-foreground">
                          ${(rep.quota / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <Progress value={quotaProgress} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                      <span className="font-semibold text-orange-600">{rep.winRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-blue-600">
                      ${(rep.avgDealSize / 1000).toFixed(0)}K
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(rep.status)}>
                      {rep.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TeamPerformanceTable;
