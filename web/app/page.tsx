"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Zap,
  BarChart3,
  Trophy,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      // Simulate fetching stats
      setTimeout(() => {
        setStats({
          total: 12,
          completed: 5,
          inProgress: 4,
          pending: 3,
        });
        setLoading(false);
      }, 300);
    }
  }, [user, router]);

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
            <Sparkles className="h-8 w-8 text-primary animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="pt-8 pb-12">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
              Welcome back, {user?.name?.split(" ")[0]}!
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            Stay organized and productive with your personal task manager. Track
            your progress and accomplish your goals.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => router.push("/tasks/new")}
              className="gap-2 shadow-soft-md hover:shadow-soft-lg transition-all"
              size="lg"
            >
              <Zap className="h-5 w-5" />
              Create New Task
            </Button>
            <Button
              onClick={() => router.push("/tasks")}
              variant="outline"
              className="gap-2"
              size="lg"
            >
              View All Tasks
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6 hover:shadow-soft-md transition-shadow border-l-4 border-l-primary/30 hover:border-l-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Total Tasks
              </p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-soft-md transition-shadow border-l-4 border-l-success/30 hover:border-l-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Completed
              </p>
              <p className="text-3xl font-bold mt-2">{stats.completed}</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-soft-md transition-shadow border-l-4 border-l-info/30 hover:border-l-info">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                In Progress
              </p>
              <p className="text-3xl font-bold mt-2">{stats.inProgress}</p>
            </div>
            <div className="p-3 bg-info/10 rounded-lg">
              <Clock className="h-6 w-6 text-info" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-soft-md transition-shadow border-l-4 border-l-warning/30 hover:border-l-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Pending
              </p>
              <p className="text-3xl font-bold mt-2">{stats.pending}</p>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg">
              <AlertCircle className="h-6 w-6 text-warning" />
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-soft-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Completion Rate</h3>
            <Trophy className="h-5 w-5 text-primary" />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-bold text-primary">
                  {Math.round((stats.completed / stats.total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-primary/60 h-full transition-all duration-500"
                  style={{
                    width: `${(stats.completed / stats.total) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="pt-4 grid grid-cols-3 gap-3 text-center">
              <div>
                <Badge variant="success" className="justify-center w-full mb-2">
                  {stats.completed}
                </Badge>
                <p className="text-xs text-muted-foreground">Done</p>
              </div>
              <div>
                <Badge variant="info" className="justify-center w-full mb-2">
                  {stats.inProgress}
                </Badge>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div>
                <Badge variant="warning" className="justify-center w-full mb-2">
                  {stats.pending}
                </Badge>
                <p className="text-xs text-muted-foreground">To Do</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-soft-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Quick Tips</h3>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>

          <div className="space-y-4">
            <div className="flex gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <div className="flex-shrink-0">
                <Zap className="h-5 w-5 text-primary mt-0.5" />
              </div>
              <div>
                <p className="font-medium text-sm">Set priorities</p>
                <p className="text-xs text-muted-foreground">
                  Mark urgent tasks to stay focused
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
              </div>
              <div>
                <p className="font-medium text-sm">Add due dates</p>
                <p className="text-xs text-muted-foreground">
                  Never miss a deadline with reminders
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              </div>
              <div>
                <p className="font-medium text-sm">Track progress</p>
                <p className="text-xs text-muted-foreground">
                  Celebrate your completed tasks
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Features Section */}
      {/* <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/0 border-primary/20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Everything you need to manage tasks effectively and boost your
            productivity
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Quick Create</h3>
              <p className="text-sm text-muted-foreground">
                Add tasks instantly with priority and due dates
              </p>
            </div>

            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Filter className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Smart Filters</h3>
              <p className="text-sm text-muted-foreground">
                Organize tasks by status, priority, and dates
              </p>
            </div>

            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Track your productivity and completion rates
              </p>
            </div>
          </div>
        </div>
      </Card> */}
    </div>
  );
}

// Add missing import
import { Filter } from "lucide-react";
