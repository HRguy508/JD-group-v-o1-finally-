import { useState } from 'react';
import { MapPin, Clock, Check, Mail, Phone, ChevronRight } from 'lucide-react';
import { ShareJobButton } from './ShareJobButton';
import { Toast } from './Toast';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { JobApplicationModal } from './JobApplicationModal';
import { ApplicationsTable } from './ApplicationsTable';

interface Position {
  title: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  positions?: number;
}

interface Department {
  department: string;
  positions: Position[];
}

export function CareersPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const { user } = useAuth();

  const isPositionFilled = (title: string) => {
    const filledPositions = [
      "Chief Executive Officer (CEO)",
      "Chief Financial Officer (CFO)",
      "Chief Operations Officer (COO)",
      "Human Resources Manager",
      "Web Developer"
    ];
    return filledPositions.includes(title);
  };

  const handleApplyClick = (jobTitle: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      setSelectedJobTitle(jobTitle);
      return;
    }
    setSelectedJobTitle(jobTitle);
    setShowApplicationModal(true);
  };

  const handleApplicationSuccess = () => {
    setToast({
      message: 'Application submitted successfully!',
      type: 'success'
    });
    setShowApplicationModal(false);
    setSelectedJobTitle('');
  };

  const careers: Department[] = [
    {
      department: "Executive and Management Roles",
      positions: [
        {
          title: "Chief Executive Officer (CEO)",
          location: "Kampala",
          type: "Full-time",
          description: "Lead the organization's strategy and operations.",
          requirements: [
            "10+ years executive leadership experience",
            "Master's degree in Business Administration or related field",
            "Proven track record in business growth",
            "Strong strategic planning abilities"
          ]
        },
        {
          title: "Chief Financial Officer (CFO)",
          location: "Kampala",
          type: "Full-time",
          description: "Oversee financial planning and management.",
          requirements: [
            "8+ years financial management experience",
            "CPA/ACCA qualification",
            "Master's degree in Finance or related field",
            "Experience in international business"
          ]
        },
        {
          title: "Chief Operations Officer (COO)",
          location: "Kampala",
          type: "Full-time",
          description: "Ensure efficient business operations.",
          requirements: [
            "8+ years operations management experience",
            "Master's degree in Business or related field",
            "Strong operational leadership skills",
            "Experience in retail operations"
          ]
        },
        {
          title: "General Manager",
          location: "Kampala",
          type: "Full-time",
          description: "Manage overall business operations in Uganda.",
          requirements: [
            "7+ years management experience",
            "Bachelor's degree in Business or related field",
            "Strong leadership abilities",
            "Experience in retail industry"
          ]
        },
        {
          title: "Human Resources Manager",
          location: "Kampala",
          type: "Full-time",
          description: "Handle recruitment, employee relations, and contracts.",
          requirements: [
            "5+ years HR experience",
            "Bachelor's degree in HR or related field",
            "Knowledge of Uganda labor laws",
            "Strong interpersonal skills"
          ]
        }
      ]
    },
    {
      department: "Retail and Product Management",
      positions: [
        {
          title: "Store Supervisor",
          location: "Multiple Locations",
          type: "Full-time",
          description: "Lead and supervise store operations, manage staff, and ensure excellent customer service standards.",
          requirements: [
            "1 year retail experience",
            "Diploma or equivalent",
            "Strong leadership skills",
            "Excellent communication abilities"
          ]
        },
        {
          title: "Inventory Officer",
          location: "Multiple Locations",
          type: "Full-time",
          positions: 3,
          description: "Maintain stock accuracy and ensure timely restocking.",
          requirements: [
            "1+ year inventory experience",
            "Diploma in Business or related field",
            "Strong analytical skills",
            "Attention to detail"
          ]
        },
        {
          title: "Sales Personnel",
          location: "Multiple Locations",
          type: "Full-time",
          positions: 30,
          description: "Join our sales team to provide exceptional customer service and drive sales growth.",
          requirements: [
            "1 year customer service experience",
            "High school diploma",
            "Strong interpersonal skills",
            "Goal-oriented mindset"
          ]
        },
        {
          title: "E-commerce Assistant",
          location: "Kampala",
          type: "Full-time",
          description: "Support online sales and customer engagement.",
          requirements: [
            "1+ year e-commerce experience",
            "Diploma in Business or related field",
            "Digital marketing skills",
            "Customer service orientation"
          ]
        }
      ]
    },
    {
      department: "Customer Service and Support",
      positions: [
        {
          title: "Customer Service Representative",
          location: "Kampala",
          type: "Full-time",
          positions: 15,
          description: "Address customer inquiries via WhatsApp, email, and calls.",
          requirements: [
            "1+ year customer service experience",
            "Diploma or equivalent",
            "Excellent communication skills",
            "Computer literacy"
          ]
        },
        {
          title: "Call Center Operator",
          location: "Kampala",
          type: "Full-time",
          positions: 8,
          description: "Handle high volumes of customer calls professionally.",
          requirements: [
            "1+ year call center experience",
            "High school diploma",
            "Excellent phone etiquette",
            "Multi-tasking abilities"
          ]
        },
        {
          title: "Social Media Assistant",
          location: "Kampala",
          type: "Full-time",
          description: "Monitor and respond to customer interactions online.",
          requirements: [
            "1+ year social media experience",
            "Diploma in Marketing or related field",
            "Strong writing skills",
            "Creative mindset"
          ]
        }
      ]
    },
    {
      department: "Marketing and Communications",
      positions: [
        {
          title: "Marketing Specialist",
          location: "Kampala",
          type: "Full-time",
          description: "Develop and execute marketing campaigns.",
          requirements: [
            "3+ years marketing experience",
            "Bachelor's degree in Marketing",
            "Strong analytical skills",
            "Creative problem-solving abilities"
          ]
        },
        {
          title: "Content Creator",
          location: "Kampala",
          type: "Full-time",
          description: "Produce engaging material for digital platforms.",
          requirements: [
            "2+ years content creation experience",
            "Diploma in Communications or related field",
            "Strong writing skills",
            "Proficiency in design tools"
          ]
        },
        {
          title: "SEO Associate",
          location: "Kampala",
          type: "Full-time",
          description: "Optimize content for search engines to increase visibility.",
          requirements: [
            "2+ years SEO experience",
            "Digital marketing certification",
            "Analytical mindset",
            "Technical SEO knowledge"
          ]
        }
      ]
    },
    {
      department: "IT and Technology Roles",
      positions: [
        {
          title: "Web Developer",
          location: "Kampala",
          type: "Full-time",
          description: "Design and maintain the company's website.",
          requirements: [
            "3+ years web development experience",
            "Bachelor's degree in Computer Science",
            "Full-stack development skills",
            "Experience with modern frameworks"
          ]
        },
        {
          title: "IT Support Technician",
          location: "Multiple Locations",
          type: "Full-time",
          positions: 5,
          description: "Address technical hardware and software issues.",
          requirements: [
            "2+ years IT support experience",
            "IT certification",
            "Strong troubleshooting skills",
            "Customer service orientation"
          ]
        },
        {
          title: "Data Analyst",
          location: "Kampala",
          type: "Full-time",
          description: "Provide insights based on business and logistics data.",
          requirements: [
            "2+ years data analysis experience",
            "Bachelor's degree in Statistics or related field",
            "Strong analytical skills",
            "Proficiency in data tools"
          ]
        },
        {
          title: "Cybersecurity Officer",
          location: "Kampala",
          type: "Full-time",
          description: "Protect the company's digital infrastructure.",
          requirements: [
            "3+ years cybersecurity experience",
            "Security certifications",
            "Knowledge of security protocols",
            "Incident response experience"
          ]
        }
      ]
    },
    {
      department: "Finance and Accounting",
      positions: [
        {
          title: "Financial Analyst",
          location: "Kampala",
          type: "Full-time",
          description: "Analyze and forecast financial performance.",
          requirements: [
            "3+ years financial analysis experience",
            "Bachelor's degree in Finance",
            "Strong analytical skills",
            "Proficiency in financial modeling"
          ]
        },
        {
          title: "Accountant",
          location: "Kampala",
          type: "Full-time",
          positions: 3,
          description: "Manage financial records and compliance.",
          requirements: [
            "2+ years accounting experience",
            "CPA qualification",
            "Knowledge of accounting standards",
            "Attention to detail"
          ]
        },
        {
          title: "Tax Collector",
          location: "Multiple Locations",
          type: "Full-time",
          positions: 5,
          description: "Ensure accurate tax reporting and compliance.",
          requirements: [
            "2+ years tax experience",
            "Diploma in Accounting",
            "Knowledge of tax regulations",
            "Strong communication skills"
          ]
        }
      ]
    },
    {
      department: "Entry-Level and Support Roles",
      positions: [
        {
          title: "Security Guard",
          location: "Multiple Locations",
          type: "Full-time",
          positions: 10,
          description: "Ensure the safety of premises and personnel.",
          requirements: [
            "Security training certificate",
            "Physical fitness",
            "Basic education",
            "Good communication skills"
          ]
        },
        {
          title: "Cleaner",
          location: "Multiple Locations",
          type: "Full-time",
          positions: 10,
          description: "Maintain cleanliness in offices and stores.",
          requirements: [
            "Basic education",
            "Previous cleaning experience preferred",
            "Attention to detail",
            "Reliable and punctual"
          ]
        },
        {
          title: "Intern",
          location: "Multiple Departments",
          type: "Full-time",
          positions: 15,
          description: "Gain hands-on experience across various departments.",
          requirements: [
            "Recent graduate or final year student",
            "Relevant field of study",
            "Eager to learn",
            "Good communication skills"
          ]
        },
        {
          title: "Office Attendant",
          location: "Multiple Locations",
          type: "Full-time",
          positions: 8,
          description: "Assist in clerical and day-to-day office tasks.",
          requirements: [
            "High school diploma",
            "Basic computer skills",
            "Good organizational skills",
            "Professional demeanor"
          ]
        },
        {
          title: "Data Entry Clerk",
          location: "Kampala",
          type: "Full-time",
          positions: 10,
          description: "Accurately input data into systems.",
          requirements: [
            "High school diploma",
            "Fast typing speed",
            "Attention to detail",
            "Basic computer skills"
          ]
        }
      ]
    },
    {
      department: "Logistics and Transportation Roles",
      positions: [
        {
          title: "Logistics Coordinator",
          location: "Namanve Industrial Park",
          type: "Full-time",
          description: "Oversee supply chain and transportation logistics.",
          requirements: [
            "3+ years logistics experience",
            "Bachelor's degree in Supply Chain or related field",
            "Strong organizational skills",
            "Experience with logistics software"
          ]
        },
        {
          title: "Fleet Supervisor",
          location: "Namanve Industrial Park",
          type: "Full-time",
          description: "Manage vehicle maintenance, schedules, and compliance.",
          requirements: [
            "3+ years fleet management experience",
            "Diploma in Automotive or related field",
            "Knowledge of transportation regulations",
            "Strong technical skills"
          ]
        },
        {
          title: "Truck/Delivery Driver",
          location: "Multiple Locations",
          type: "Full-time",
          positions: 15,
          description: "Transport goods across regions.",
          requirements: [
            "Valid driving license",
            "2+ years commercial driving experience",
            "Clean driving record",
            "Knowledge of road safety regulations"
          ]
        },
        {
          title: "Customs and Documentation Officer",
          location: "Kampala",
          type: "Full-time",
          description: "Manage cross-border shipping compliance.",
          requirements: [
            "3+ years customs experience",
            "Diploma in Logistics or related field",
            "Knowledge of customs regulations",
            "Attention to detail"
          ]
        },
        {
          title: "Cargo Loader",
          location: "Multiple Locations",
          type: "Full-time",
          positions: 10,
          description: "Load and unload goods in warehouses and delivery vehicles.",
          requirements: [
            "Physical fitness",
            "Basic education",
            "Ability to work in shifts",
            "Team player attitude"
          ]
        }
      ]
    }
  ];

  return (
    <div className="pt-24 pb-16 bg-secondary-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-text mb-4">Join Our Team</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Welcome to JD Group Careers! As we expand our operations into Uganda, we are thrilled to offer over 200 career 
            opportunities across various departments. We are seeking talented, passionate individuals to join our growing team 
            and help deliver world-class products and services.
          </p>
        </div>

        {careers.map((department, deptIndex) => (
          <div key={deptIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-primary-text mb-6">{department.department}</h2>
            <div className="grid gap-6">
              {department.positions.map((job, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-primary-text mb-2">
                          {job.title}
                          {job.positions && !isPositionFilled(job.title) && (
                            <span className="ml-2 text-primary-cta">({job.positions} positions)</span>
                          )}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-1 text-primary-cta" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-1 text-primary-cta" />
                            {job.type}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{job.description}</p>

                      <div>
                        <h4 className="font-semibold text-primary-text mb-2">Requirements:</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {job.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 mt-4 border-t border-gray-100">
                        {isPositionFilled(job.title) ? (
                          <div className="flex items-center px-6 py-2 bg-green-50 text-green-700 rounded-full border border-green-200">
                            <Check className="h-5 w-5 mr-2" />
                            Position Filled
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button 
                              onClick={() => handleApplyClick(job.title)}
                              className="bg-primary-cta text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-colors duration-200 flex items-center justify-center"
                            >
                              Apply Now
                              <ChevronRight className="h-5 w-5 ml-1" />
                            </button>
                            <ShareJobButton 
                              jobId={job.title.toLowerCase().replace(/\s+/g, '-')} 
                              jobTitle={job.title} 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-12 bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-primary-text mb-4">How to Apply</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              We welcome applications from experienced professionals, fresh graduates, and those seeking 
              entry-level opportunities. To apply:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Click the "Apply Now" button next to the position you're interested in</li>
              <li>Complete the application form with your details</li>
              <li>Upload a single PDF document containing your CV, academic certificates, National ID copy, and cover letter</li>
              <li>Submit your application and wait for our HR team to contact you</li>
            </ul>
            <div className="mt-6 space-y-2">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary-cta" />
                <a href="mailto:hrjdgroupco@gmail.com" className="text-primary-cta hover:underline">
                  hrjdgroupco@gmail.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary-cta" />
                <span>+256784772829 / +256702554028</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add ApplicationsTable for admin users */}
      {user?.email === 'admin@jdgroup.co.ug' && (
        <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-primary-text mb-6">Job Applications</h2>
          <ApplicationsTable />
        </div>
      )}

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <form className="space-y-4">
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="contact-email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-cta focus:ring focus:ring-primary-cta focus:ring-opacity-50"
            />
          </div>
        </form>
      </div>

      <JobApplicationModal
        isOpen={showApplicationModal}
        jobTitle={selectedJobTitle}
        onClose={() => setShowApplicationModal(false)}
        onSuccess={handleApplicationSuccess}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setSelectedJobTitle('');
        }}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          if (selectedJobTitle) {
            setShowApplicationModal(true);
          }
        }}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}