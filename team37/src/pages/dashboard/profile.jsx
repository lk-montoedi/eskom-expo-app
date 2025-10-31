import React, { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit3,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Book,
  PenBoxIcon,
  PencilOffIcon,
  Briefcase,
  Star,
  Layers,
} from 'lucide-react';
import profilepic from "../../assets/aboutUsAssets/profilepic.png";

function Profile() {
  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const userId = localStorage.getItem("userId");

  // data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [judgeInfo, setJudgeInfo] = useState(null);
  const [userData, setUserData] = useState(null);

  // form state
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    firstContact: '',
    secondContact: '',
    email: '',
    profilePicture: '',
    province: '',
    region: '',
    district: '',
    schoolName: '',
    grade: '',
    disability: '',
    disabilityInfo: '',
    race: '',
    gender: '',
    dateOfBirth: '',
    role: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const provinces = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'Northern Cape',
    'North West',
    'Western Cape',
  ];

  // -------------------------
  // Helpers: fetch & update
  // -------------------------
  const fetchFullUserData = async (userId, signal) => {
    // fetches user profile and returns parsed profile object (or throws)
    const res = await fetch(`/api/user/get/userProfile/${userId}`, { signal });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Failed to fetch user data (${res.status}) ${text}`);
    }
    const json = await res.json();
    // your backend returns { profile: { ... } } per original code
    return json.profile ?? json;
  };

  const fetchJudgeDetails = async (userId, signal) => {
    const res = await fetch(`/api/judge/get/details/${userId}`, { signal });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Failed to fetch judge info (${res.status}) ${text}`);
    }
    return res.json();
  };

  // Combined initialization: loads user profile, then judge info if role requires it
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const init = async () => {
      try {
        setLoading(true);
        setError(null);
        setJudgeInfo(null);

        // session storage should contain userData as before
        const storedUserData = sessionStorage.getItem('userData');
        if (!storedUserData) {
          setError('User not logged in.');
          setLoading(false);
          return;
        }

        const parsed = JSON.parse(storedUserData);
        const userId = parsed.userid || parsed.userId || parsed.id;
        if (!userId) {
          setError('Invalid session user id.');
          setLoading(false);
          return;
        }

        // 1) load user profile
        const profile = await fetchFullUserData(userId, signal);
        if (!profile) {
          setError('No profile data returned');
          setLoading(false);
          return;
        }
        console.log("My vibe is ruined: ", profile);
        setUserData(profile);
        setFormData({
          name: profile.name || '',
          surname: profile.surname || '',
          email: profile.email || '',
          firstContact: profile.firstcontact || '',
          secondContact: profile.secondcontact || '',
          profilePicture: profile.profilepicture || '',
          province: profile.province || '',
          region: profile.region || '',
          district: profile.district || '',
          schoolName: profile.schoolname || '',
          grade: profile.grade || '',
          disability: profile.disability || '',
          disabilityInfo: profile.disabilityinfo || '',
          race: profile.race || '',
          gender: profile.gender || '',
          dateOfBirth: profile.dateofbirth || '',
          role: profile.role || '',
        });

        // Conditionally load judge info (localStorage role could be used as well)
        const role = localStorage.getItem('userRole') || profile.role;
        if (role === 'judge' || role === 'convener') {
          try {
            const judgeData = await fetchJudgeDetails(userId, signal);
            console.log("Bafetho ke bana", judgeData.judgeDetails);
            setJudgeInfo(judgeData.judgeDetails);
          } catch (judgeErr) {
            console.error('Judge fetch error:', judgeErr);
            setJudgeInfo(null);
          }
        }

        setLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') {
          // component unmounted or new fetch started — ignore
          return;
        }
        console.error(err);
        setError('Failed to load user profile.');
        setLoading(false);
      }
    };

    init();

    // cleanup
    return () => controller.abort();
    // empty dependency array so it runs once on mount
  }, []);

  // -------------------------
  // Handlers
  // -------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData?.userid) {
      alert('Missing user id. Cannot update profile.');
      return;
    }

    try {
      const response = await fetch(`/api/user/update/user/profile/${userData.userid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Failed to update profile: ${response.status} ${text}`);
      }

      // success — refresh profile view
      setBannerMessage('Profile updated successfully!');
      setShowSuccessBanner(true);
      setIsEditing(false);

      // refresh data from server to ensure form and userData are in sync
      try {
        const refreshed = await fetchFullUserData(userData.userid);
        setUserData(refreshed);
        setFormData((prev) => ({
          ...prev,
          // keep fields that might not change from server; update from refreshed where present
          name: refreshed.name || prev.name,
          surname: refreshed.surname || prev.surname,
          email: refreshed.email || prev.email,
          firstContact: refreshed.firstcontact || prev.firstContact,
          secondContact: refreshed.secondcontact || prev.secondContact,
          profilePicture: refreshed.profilepicture || prev.profilePicture,
          province: refreshed.province || prev.province,
          region: refreshed.region || prev.region,
          district: refreshed.district || prev.district,
          schoolName: refreshed.schoolname || prev.schoolName,
          grade: refreshed.grade || prev.grade,
          disability: refreshed.disability || prev.disability,
          disabilityInfo: refreshed.disabilityinfo || prev.disabilityInfo,
          race: refreshed.race || prev.race,
          gender: refreshed.gender || prev.gender,
          dateOfBirth: refreshed.dateofbirth || prev.dateOfBirth,
          role: refreshed.role || prev.role,
        }));
      } catch (refreshErr) {
        // not critical — we already updated successfully
        console.warn('Failed to refresh profile after update', refreshErr);
      }

      setTimeout(() => setShowSuccessBanner(false), 5000);
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating the profile.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!userData?.userid) {
      alert('Missing user id. Cannot update password.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }

    try {
      const response = await fetch(`/api/user/update/user/password/${userData.userid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Password update failed: ${response.status} ${text}`);
      }

      setBannerMessage('Password updated successfully!');
      setShowSuccessBanner(true);
      setShowPasswordUpdate(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowSuccessBanner(false), 5000);
    } catch (err) {
      console.error(err);
      alert('Failed to update password. Please check your current password.');
    }
  };

  const handleCancel = () => {
    // revert form values to latest userData
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        name: userData.name || '',
        surname: userData.surname || '',
        email: userData.email || '',
        firstContact: userData.firstcontact || '',
        secondContact: userData.secondcontact || '',
        profilePicture: userData.profilepicture || '',
        province: userData.province || '',
        region: userData.region || '',
        district: userData.district || '',
        schoolName: userData.schoolname || '',
        grade: userData.grade || '',
        disability: userData.disability || '',
        disabilityInfo: userData.disabilityinfo || '',
        race: userData.race || '',
        gender: userData.gender || '',
        dateOfBirth: userData.dateofbirth || '',
        role: userData.role || '',
      }));
    }
    setIsEditing(false);
    setShowPasswordUpdate(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // -------------------------
  // Render states
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-blue-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Role-specific fields renderer
  const renderLearnerFields = () => (
    <>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-blue-900">School Name</label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
          <input
            type="text"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-50 disabled:text-blue-700"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-blue-900">Grade</label>
        <div className="relative">
          <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
          <input
            type="text"
            name="grade"
            value={formData.grade}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-50 disabled:text-blue-700"
          />
        </div>
      </div>

      {formData.disability && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-900">Disability</label>
            <input
              type="text"
              value={formData.disability}
              disabled
              className="w-full px-4 py-3 border border-blue-200 rounded-lg bg-blue-50 text-blue-700 cursor-not-allowed"
            />
          </div>

          {formData.disabilityInfo && (
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-blue-900">
                Disability Information
              </label>
              <textarea
                value={formData.disabilityInfo}
                disabled
                rows={3}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg bg-blue-50 text-blue-700 cursor-not-allowed"
              />
            </div>
          )}
        </>
      )}
    </>
  );

  const renderJudgeFields = () => (
    <>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-blue-900">Years in Experience</label>
        <div className="relative">
          <PenBoxIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
          <input
            type="number"
            value={judgeInfo?.yearsjudged || ''}
            disabled
            className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg bg-blue-50 text-blue-700 cursor-not-allowed"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-blue-900">Number of Events Judged</label>
        <div className="relative">
          <PencilOffIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
          <input
            type="number"
            value={judgeInfo?.numeventsjudged}
            disabled
            className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg bg-blue-50 text-blue-700 cursor-not-allowed"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-blue-900">First Category</label>
        <div className="relative">
          <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
          <input
            type="text"
            value={judgeInfo?.firstcategory || ''}
            disabled={!isEditing}
            className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-50 disabled:text-blue-700"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-blue-900">Second Category</label>
        <div className="relative">
          <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
          <input
            type="text"
            value={judgeInfo?.secondcategory || ''}
            disabled={!isEditing}
            className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-50 disabled:text-blue-700"
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Banner */}
        {showSuccessBanner && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2 animate-pulse">
            <CheckCircle size={20} className="text-green-600" />
            <span className="font-medium">{bannerMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Eskom Expo for Young Scientists</h1>
          <p className="text-blue-600">Update Your Profile</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          {/* Cover Section */}
          <div className="h-32 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 border-b border-blue-700/50 backdrop-blur-md bg-opacity-95">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-4 right-4 flex gap-2">
              {!isEditing && !showPasswordUpdate ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors flex items-center space-x-2"
                  >
                    <Edit3 size={16} />
                    <span className="text-sm font-medium">Edit Profile</span>
                  </button>
                  <button
                    onClick={() => setShowPasswordUpdate(true)}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors flex items-center space-x-2"
                  >
                    <Lock size={16} />
                    <span className="text-sm font-medium">Change Password</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCancel}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors flex items-center space-x-2"
                >
                  <X size={16} />
                  <span className="text-sm font-medium">Cancel</span>
                </button>
              )}
            </div>
          </div>

          {/* Profile Section */}
          <div className="px-6 pb-6">
            <div className="flex flex-col items-center -mt-12 mb-6">
              <div className="relative">
                <img
                  src={formData.profilepicture || profilepic}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <Camera size={16} />
                  </button>
                )}
              </div>
              <h2 className="text-2xl font-bold text-blue-900 mt-4">
                {formData.name} {formData.surname}
              </h2>
              <p className="text-blue-600 font-medium capitalize">{formData.role}</p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Password Update Section */}
              {showPasswordUpdate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-blue-900">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-blue-900">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter new password (min 8 characters)"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-blue-900">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        onClick={() => setShowPasswordUpdate(false)}
                        className="px-6 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePasswordSubmit}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600  text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Save size={20} />
                        <span>Update Password</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Editable Fields */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-blue-900">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-50 disabled:text-blue-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-blue-900">Surname</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-50 disabled:text-blue-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-blue-900">First Contact</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
                    <input
                      type="tel"
                      name="firstContact"
                      value={formData.firstContact}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-50 disabled:text-blue-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-blue-900">Second Contact</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
                    <input
                      type="tel"
                      name="secondContact"
                      value={formData.secondContact}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-50 disabled:text-blue-700"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-blue-900">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-50 disabled:text-blue-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-blue-900">Province</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-50 disabled:text-blue-700"
                    >
                      {provinces.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-blue-900">Region</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-50 disabled:text-blue-700"
                    />
                  </div>
                </div>

                {/* Role-specific fields */}
                {formData.role === 'learner' && renderLearnerFields()}
                {(formData.role === 'judge' || formData.role === 'convener') && judgeInfo && renderJudgeFields()}

              </div>

              {/* Non-editable Fields */}
              <div className="border-t border-blue-100 pt-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">System Information (Cannot be modified)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-blue-700">User ID</label>
                    <input
                      type="text"
                      value={userId || ''}
                      disabled
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg bg-blue-50 text-blue-700 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-blue-700">Role</label>
                    <input
                      type="text"
                      value={formData.role}
                      disabled
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg bg-blue-50 text-blue-700 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600  text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Save size={20} />
                    <span>Update Profile</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-600">
          <p className="text-sm">For technical support, contact the Eskom Expo administration.</p>
        </div>
      </div>
    </div>
  );
}

export { Profile };