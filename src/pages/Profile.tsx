
import React from "react";
import { User, Calendar, Mail, Clock, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Profile = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null; // This shouldn't render due to redirect
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <Card className="sticky top-24">
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle className="flex items-center text-lg">
                  <User className="mr-2 h-5 w-5 text-blue-600" />
                  Account Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile Info
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate("/withdrawals")}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Withdrawal Requests
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate("/account-settings")}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Account Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-3/4">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="text-xl">Your Profile Information</CardTitle>
                <CardDescription className="text-blue-100">
                  Your personal account details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="bg-blue-100 rounded-full p-3">
                      <User className="h-10 w-10 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{userProfile.fullName || user.email?.split('@')[0] || 'VAIOT Investor'}</h3>
                      <p className="text-gray-500 text-sm">Account holder</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Mail className="h-5 w-5 text-gray-600 mr-2" />
                        <h4 className="font-medium">Email Address</h4>
                      </div>
                      <p className="text-gray-700">{user.email}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                        <h4 className="font-medium">Account Created</h4>
                      </div>
                      <p className="text-gray-700">
                        {userProfile.createdAt ? format(new Date(userProfile.createdAt), 'PPP') : 'Not available'}
                      </p>
                    </div>

                    {userProfile.lastSignInAt && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Clock className="h-5 w-5 text-gray-600 mr-2" />
                          <h4 className="font-medium">Last Sign In</h4>
                        </div>
                        <p className="text-gray-700">
                          {format(new Date(userProfile.lastSignInAt), 'PPP')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Security Information</CardTitle>
                <CardDescription>
                  Information about your account security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline">Setup 2FA</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-gray-500">Change your password</p>
                    </div>
                    <Button variant="outline">Update Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
