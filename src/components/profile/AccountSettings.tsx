
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AccountSettingsProps {
  userEmail: string | undefined;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ userEmail }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account preferences and security</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="Your email address"
            value={userEmail || ''}
            disabled
          />
          <p className="text-sm text-muted-foreground">
            Your email address cannot be changed
          </p>
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h3 className="text-sm font-medium mb-3">Change Password</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Password changes will be implemented in a future update
          </p>
          <Button variant="outline" disabled>
            Change Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
