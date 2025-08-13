import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { User, Briefcase, Heart, Target, ArrowRight, ArrowLeft } from "lucide-react";

export interface FormData {
  // Personal Profile
  name?: string;
  age: number;
  occupation: string;
  education?: string;
  personalityTraits: string[];
  
  // Lifestyle Preferences
  climate: string;
  cityType: string;
  budgetRange: number[];
  familyStatus: string;
  activityPreferences: string[];
  
  // Career Preferences
  workFlexibility: string;
  industryRelevance: string;
  careerGoals: string[];
  
  // Values & Life Goals
  communityType: string;
  paceOfLife: string;
  lifeGoalFocus: string[];
  
  // Additional details
  additionalDetails?: string;
}

interface ExplorerFormProps {
  onSubmit: (data: FormData) => void;
  onBack: () => void;
  isLoading: boolean;
}

const ExplorerForm = ({ onSubmit, onBack, isLoading }: ExplorerFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    age: 25,
    occupation: "",
    personalityTraits: [],
    climate: "",
    cityType: "",
    budgetRange: [2000],
    familyStatus: "",
    activityPreferences: [],
    workFlexibility: "",
    industryRelevance: "",
    careerGoals: [],
    communityType: "",
    paceOfLife: "",
    lifeGoalFocus: [],
  });

  const steps = [
    { title: "Personal Profile", icon: User },
    { title: "Lifestyle Preferences", icon: Heart },
    { title: "Career Preferences", icon: Briefcase },
    { title: "Values & Goals", icon: Target },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: string, item: string) => {
    setFormData(prev => {
      const currentValue = prev[field as keyof FormData] as string[] || [];
      return {
        ...prev,
        [field]: currentValue.includes(item)
          ? currentValue.filter(i => i !== item)
          : [...currentValue, item]
      };
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateFormData("age", parseInt(e.target.value))}
                  min="18"
                  max="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="occupation">Occupation / Industry</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => updateFormData("occupation", e.target.value)}
                  placeholder="e.g., Software Engineer, Teacher"
                />
              </div>
              <div>
                <Label htmlFor="education">Education Level (Optional)</Label>
                <Select onValueChange={(value) => updateFormData("education", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="professional">Professional Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Personality Traits</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {["Adventurous", "Social", "Introverted", "Artistic", "Career-driven", "Nature-lover", "Tech-savvy", "Family-oriented"].map((trait) => (
                  <label key={trait} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={formData.personalityTraits.includes(trait)}
                      onCheckedChange={() => toggleArrayItem("personalityTraits", trait)}
                    />
                    <span className="text-sm">{trait}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Climate Preference</Label>
                <Select onValueChange={(value) => updateFormData("climate", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select climate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cold">Cold</SelectItem>
                    <SelectItem value="temperate">Temperate</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="tropical">Tropical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>City Type</Label>
                <Select onValueChange={(value) => updateFormData("cityType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urban">Urban</SelectItem>
                    <SelectItem value="suburban">Suburban</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Monthly Budget Range (USD): ${formData.budgetRange[0]}</Label>
              <Slider
                value={formData.budgetRange}
                onValueChange={(value) => updateFormData("budgetRange", value)}
                max={10000}
                min={500}
                step={250}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Family Status</Label>
              <Select onValueChange={(value) => updateFormData("familyStatus", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select family status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="couple">Couple</SelectItem>
                  <SelectItem value="children">With Children</SelectItem>
                  <SelectItem value="pets">With Pets</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Activity Preferences</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {["Hiking", "Nightlife", "Cultural Events", "Tech Hubs", "Quiet Lifestyle", "Beach Activities", "Winter Sports", "Art & Museums"].map((activity) => (
                  <label key={activity} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={formData.activityPreferences.includes(activity)}
                      onCheckedChange={() => toggleArrayItem("activityPreferences", activity)}
                    />
                    <span className="text-sm">{activity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Work Flexibility</Label>
                <Select onValueChange={(value) => updateFormData("workFlexibility", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="in-person">In-person</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="industryRelevance">Industry Relevance</Label>
                <Input
                  id="industryRelevance"
                  value={formData.industryRelevance}
                  onChange={(e) => updateFormData("industryRelevance", e.target.value)}
                  placeholder="e.g., Tech, Healthcare, Finance"
                />
              </div>
            </div>

            <div>
              <Label>Career Goals</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {["Growth", "Work-Life Balance", "Networking", "Creative Freedom", "High Salary", "Job Security"].map((goal) => (
                  <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={formData.careerGoals.includes(goal)}
                      onCheckedChange={() => toggleArrayItem("careerGoals", goal)}
                    />
                    <span className="text-sm">{goal}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Community Type</Label>
                <Select onValueChange={(value) => updateFormData("communityType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select community type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diverse">Diverse</SelectItem>
                    <SelectItem value="tight-knit">Tight-knit</SelectItem>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="family-oriented">Family-oriented</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Pace of Life</Label>
                <Select onValueChange={(value) => updateFormData("paceOfLife", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fast-paced">Fast-paced</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="slow">Slow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Life Goal Focus</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {["Personal Growth", "Wealth Building", "Social Life", "Learning", "Health & Wellness", "Adventure"].map((focus) => (
                  <label key={focus} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={formData.lifeGoalFocus.includes(focus)}
                      onCheckedChange={() => toggleArrayItem("lifeGoalFocus", focus)}
                    />
                    <span className="text-sm">{focus}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="additionalDetails">Additional Details (Optional)</Label>
              <Textarea
                id="additionalDetails"
                value={formData.additionalDetails || ""}
                onChange={(e) => updateFormData("additionalDetails", e.target.value)}
                placeholder="Any specific requirements, preferences, or details you'd like to share..."
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    index <= currentStep 
                      ? 'bg-primary text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 transition-all ${
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {steps[currentStep].title}
            </h2>
            <p className="text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Form content */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-xl">
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrev}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentStep === 0 ? "Back to Home" : "Previous"}
              </Button>

              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="flex items-center gap-2 bg-gradient-primary hover:opacity-90"
              >
                {currentStep === steps.length - 1 ? (
                  isLoading ? "Finding Your Perfect Place..." : "Find My Perfect Place"
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExplorerForm;