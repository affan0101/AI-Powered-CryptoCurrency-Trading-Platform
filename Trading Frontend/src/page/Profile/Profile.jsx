import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Globe, 
  Shield, 
  Lock, 
  Phone,
  CheckCircle,
  XCircle,
  Edit,
  Send,
  Save
} from "lucide-react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { auth } = useSelector(store => store);
  
  // Default user data structure
  const defaultUserData = {
    email: auth.user?.email || "",
    fullName: auth.user?.fullName || "",
    dateOfBirth: "DOB",
    nationality: "Nationality",
    address: "Enter Address",
    city: "City",
    postcode: "PIN",
    country: "Country",
    mobile: "9149189876",
    status: "pending"
  };

  // State for user data and editing
  const [userData, setUserData] = useState(defaultUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [isTwoStepEnabled, setIsTwoStepEnabled] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProfileData = localStorage.getItem('profileData');
    const savedTwoStepEnabled = localStorage.getItem('twoStepEnabled');
    
    if (savedProfileData) {
      setUserData(JSON.parse(savedProfileData));
    } else {
      // Initialize with default data if nothing is saved
      setUserData(defaultUserData);
    }
    
    if (savedTwoStepEnabled) {
      setIsTwoStepEnabled(savedTwoStepEnabled === 'true');
    }
  }, [auth]);

  // Handle input changes for editable fields
  const handleInputChange = (field, value) => {
    setUserData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // Save profile data to localStorage
  const handleSaveProfile = () => {
    localStorage.setItem('profileData', JSON.stringify(userData));
    setIsEditing(false);
  };

  // Handle two-step verification toggle and save to localStorage
  const handleTwoStepToggle = (enabled) => {
    setIsTwoStepEnabled(enabled);
    localStorage.setItem('twoStepEnabled', enabled.toString());
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSendOtp = () => {
    setIsVerifyDialogOpen(false);
    setIsOtpDialogOpen(true);
    // In a real app, you would send the OTP to the user's email here
  };

  const handleVerifyOtp = () => {
    // In a real app, you would verify the OTP here
    setIsOtpDialogOpen(false);
    handleTwoStepToggle(true);
  };

  const handleDisableTwoStep = () => {
    setIsVerifyDialogOpen(false);
    handleTwoStepToggle(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your account information and security settings
            </p>
          </div>
          
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <Button 
              onClick={handleSaveProfile}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <Card className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 border-orange-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <CardTitle>Your Information</CardTitle>
              </div>
              <CardDescription>
                Personal details and account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Mail className="h-4 w-4" /> Email
                  </Label>
                  <Input 
                    id="email" 
                    value={userData.email} 
                    readOnly 
                    className="bg-orange-50 dark:bg-gray-700 border-orange-200 dark:border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <User className="h-4 w-4" /> Full Name
                  </Label>
                  <Input 
                    id="fullName" 
                    value={userData.fullName} 
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={isEditing ? "" : "bg-orange-50 dark:bg-gray-700 border-orange-200 dark:border-gray-600"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="h-4 w-4" /> Date Of Birth
                  </Label>
                  <Input 
                    id="dob" 
                    value={userData.dateOfBirth} 
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className={isEditing ? "" : "bg-orange-50 dark:bg-gray-700 border-orange-200 dark:border-gray-600"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Globe className="h-4 w-4" /> Nationality
                  </Label>
                  <Input 
                    id="nationality" 
                    value={userData.nationality} 
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className={isEditing ? "" : "bg-orange-50 dark:bg-gray-700 border-orange-200 dark:border-gray-600"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin className="h-4 w-4" /> Address
                  </Label>
                  <Input 
                    id="address" 
                    value={userData.address} 
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={isEditing ? "" : "bg-orange-50 dark:bg-gray-700 border-orange-200 dark:border-gray-600"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin className="h-4 w-4" /> City
                  </Label>
                  <Input 
                    id="city" 
                    value={userData.city} 
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={isEditing ? "" : "bg-orange-50 dark:bg-gray-700 border-orange-200 dark:border-gray-600"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postcode" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin className="h-4 w-4" /> Postcode
                  </Label>
                  <Input 
                    id="postcode" 
                    value={userData.postcode} 
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('postcode', e.target.value)}
                    className={isEditing ? "" : "bg-orange-50 dark:bg-gray-700 border-orange-200 dark:border-gray-600"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Globe className="h-4 w-4" /> Country
                  </Label>
                  <Input 
                    id="country" 
                    value={userData.country} 
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className={isEditing ? "" : "bg-orange-50 dark:bg-gray-700 border-orange-200 dark:border-gray-600"}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings Card */}
          <Card className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 border-orange-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <CardTitle>Security Settings</CardTitle>
              </div>
              <CardDescription>
                Manage your account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Two-Step Verification */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-orange-200 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">2 Step Verification</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isTwoStepEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={
                      isTwoStepEnabled 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0" 
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0"
                    }
                  >
                    {isTwoStepEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                  <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-900/20"
                        onClick={() => setIsVerifyDialogOpen(true)}
                      >
                        {isTwoStepEnabled ? "Disable" : "Enable"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-orange-200 dark:border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          {isTwoStepEnabled ? "Disable" : "Enable"} Two-Step Verification
                        </DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {isTwoStepEnabled 
                            ? "Are you sure you want to disable two-step verification? This will make your account less secure." 
                            : "Enhance your account security by enabling two-step verification. We will send a code to your email address."}
                        </p>
                        <div className="flex justify-end gap-3">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsVerifyDialogOpen(false)}
                            className="border-gray-300 dark:border-gray-600"
                          >
                            Cancel
                          </Button>
                          <Button 
                            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                            onClick={isTwoStepEnabled ? handleDisableTwoStep : handleSendOtp}
                          >
                            {isTwoStepEnabled ? "Disable" : "Enable"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Change Password */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-orange-200 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <Lock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Change Password</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Update your password regularly
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-900/20"
                >
                  Change
                </Button>
              </div>

              {/* Account Status */}
              <div className="p-4 rounded-lg border border-orange-200 dark:border-gray-600 bg-orange-50/50 dark:bg-orange-900/20">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Account Status</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Badge 
                    variant="outline" 
                    className={
                      userData.status === "verified" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0" 
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-0"
                    }
                  >
                    {userData.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span>{userData.email}</span>
                  </div>
                  <br />
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>{userData.mobile}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* OTP Verification Dialog */}
        <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-orange-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                Enter OTP
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                We've sent a verification code to your email address
              </p>
              
              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="w-12 h-12 text-center text-lg font-semibold border-orange-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
                  />
                ))}
              </div>
              
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsOtpDialogOpen(false)}
                  className="border-gray-300 dark:border-gray-600"
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                  onClick={handleVerifyOtp}
                >
                  Verify
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -z-10">
          <div className="bg-gradient-to-r from-orange-400/10 to-yellow-400/10 dark:from-orange-600/5 dark:to-yellow-600/5 w-96 h-96 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 -z-10">
          <div className="bg-gradient-to-r from-amber-400/10 to-orange-400/10 dark:from-amber-600/5 dark:to-orange-600/5 w-80 h-80 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;