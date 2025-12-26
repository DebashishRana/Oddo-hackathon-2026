"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Trash2, RefreshCw, Plus, Edit } from "lucide-react";
import { type User } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserManagementClientProps {
  initialUsers: User[];
}

export function UserManagementClient({ initialUsers }: UserManagementClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [, setEditingCreditsUserId] = useState<number | null>(null);
  const [creditsAmount, setCreditsAmount] = useState("");
  const [creditsAction, setCreditsAction] = useState<"add" | "set">("add");
  const { toast } = useToast();

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date | undefined | null) => {
    if (!date) return 'Never';

    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isRecentLogin = (lastLogin: Date | undefined | null) => {
    if (!lastLogin) return false;

    const now = new Date();
    const loginDate = new Date(lastLogin);
    const diffHours = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setUsers(initialUsers);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users?search=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast({
          title: "Search failed",
          description: "Failed to search users",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Search error",
        description: "An error occurred while searching",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setSearchTerm("");
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        toast({
          title: "Refreshed",
          description: "User list has been refreshed",
        });
      } else {
        toast({
          title: "Refresh failed",
          description: "Failed to refresh user list",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Refresh error",
        description: "An error occurred while refreshing",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    setDeletingUserId(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(users.filter(user => user.id !== userId));
        toast({
          title: "User deleted",
          description: `User ${data.deletedUser.email} has been deleted successfully`,
        });
      } else {
        const error = await response.json();
        toast({
          title: "Delete failed",
          description: error.error || "Failed to delete user",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Delete error",
        description: "An error occurred while deleting the user",
        variant: "destructive",
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleCreditsUpdate = async (userId: number) => {
    const amount = parseInt(creditsAmount);
    if (isNaN(amount) || amount < 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: creditsAction,
          amount: amount,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Update the user in the local state
        setUsers(users.map(user =>
          user.id === userId
            ? { ...user, credits: data.newBalance }
            : user
        ));

        toast({
          title: "Credits updated",
          description: `${creditsAction === 'add' ? 'Added' : 'Set'} ${amount} credits for ${data.user.email}. New balance: ${data.newBalance}`,
        });

        setEditingCreditsUserId(null);
        setCreditsAmount("");
      } else {
        const error = await response.json();
        toast({
          title: "Update failed",
          description: error.error || "Failed to update credits",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Update error",
        description: "An error occurred while updating credits",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          Search
        </Button>
        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* User List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm ? "No users found matching your search." : "No users found."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.image_url || ""} alt={user.name || ""} />
                  <AvatarFallback>
                    {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{user.name || "No name"}</p>
                    {isRecentLogin(user.last_login) && (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    ID: {user.id} • Credits: {user.credits} • Joined: {formatDate(user.created_at)} • Last login: {formatDate(user.last_login)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Credits Management */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingCreditsUserId(user.id);
                        setCreditsAmount("");
                        setCreditsAction("add");
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Manage Credits</DialogTitle>
                      <DialogDescription>
                        Update credits for <strong>{user.email}</strong> (Current: {user.credits} credits)
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={creditsAction === "add" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCreditsAction("add")}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                        <Button
                          variant={creditsAction === "set" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCreditsAction("set")}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Set
                        </Button>
                      </div>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={creditsAmount}
                        onChange={(e) => setCreditsAmount(e.target.value)}
                        min="0"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => handleCreditsUpdate(user.id)}
                        disabled={!creditsAmount || isNaN(parseInt(creditsAmount))}
                      >
                        {creditsAction === "add" ? "Add Credits" : "Set Credits"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Delete User */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingUserId === user.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete user <strong>{user.email}</strong>?
                        This action cannot be undone and will permanently remove all user data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete User
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredUsers.length} of {users.length} users
        {searchTerm && ` matching "${searchTerm}"`}
      </div>
    </div>
  );
}
