import { Link } from "react-router-dom";
import SimpleCanvas from "../../components/landing/SimpleCanvas";
import FadeIn from "../../components/animations/FadeIn";
import Navbar from "../../components/landing/Navbar";
import { diagram } from "../../utils/constants";
import { IconPlay, IconStar } from "@douyinfe/semi-icons";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { 
    Database, 
    Zap, 
    Users, 
    Code, 
    Eye, 
    ArrowRight, 
    Star,
    Quote
} from "lucide-react";


export default function LandingPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoSectionRef = useRef<HTMLDivElement>(null);
    const isVideoInView = useInView(videoSectionRef, { amount: 0.5 });

    useEffect(() => {
        if (!videoRef.current) return;
        try {
            if (isVideoInView) {
                // attempt to play when the section is sufficiently visible
                void videoRef.current.play();
            } else {
                // pause when the section is out of view to save resources
                videoRef.current.pause();
            }
        } catch (e) {
            // ignore play errors (browser autoplay restrictions)
            // user can still tap to play
        }
    }, [isVideoInView]);

    const features = [
        {
            icon: Database,
            title: "Visual Schema Design",
            description: "Create database schemas with our intuitive drag-and-drop interface"
        },
        {
            icon: Zap,
            title: "AI-Powered Generation",
            description: "Generate schemas instantly using advanced AI technology"
        },
        {
            icon: Code,
            title: "Export to SQL",
            description: "Generate clean, optimized SQL code for any database platform"
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description: "Work together seamlessly with real-time collaboration features"
        }
    ];

    const steps = [
        {
            number: "01",
            title: "Design Your Schema",
            description: "Use our visual editor to create tables, define relationships, and set constraints"
        },
        {
            number: "02", 
            title: "Leverage AI Assistance",
            description: "Get intelligent suggestions and auto-generate schemas from descriptions"
        },
        {
            number: "03",
            title: "Export & Deploy",
            description: "Generate SQL code and deploy to your preferred database platform"
        }
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Senior Developer",
            company: "TechCorp",
            content: "This tool has revolutionized our database design process. The AI suggestions are incredibly accurate.",
            rating: 5
        },
        {
            name: "Michael Rodriguez",
            role: "Database Architect", 
            company: "DataFlow Inc",
            content: "The visual interface makes complex schema design intuitive. Our team productivity has increased by 40%.",
            rating: 5
        },
        {
            name: "Emily Johnson",
            role: "Product Manager",
            company: "StartupXYZ",
            content: "Perfect for rapid prototyping. We can go from idea to deployable schema in minutes.",
            rating: 5
        }
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="flex flex-col h-screen bg-white">
                <div className="text-white font-semibold py-2 text-sm text-center bg-gradient-to-r from-black via-gray-800 to-black shadow-lg" />

                <FadeIn duration={0.6}>
                    <Navbar />
                </FadeIn>

                <div className="flex-1 flex-col relative mx-4 md:mx-0 mb-4 rounded-3xl bg-white shadow-2xl border border-gray-100">
                    <div className="h-full rounded-3xl overflow-hidden">
                        <SimpleCanvas diagram={diagram} zoom={0.85} />
                    </div>
                    <div className="hidden md:block h-full bg-dots opacity-20" />
                    <div className="absolute left-12 w-[45%] top-[50%] translate-y-[-54%] md:left-[50%] md:translate-x-[-50%] p-8 md:p-3 md:w-full text-black">
                        <FadeIn duration={0.75}>
                            <div className="md:px-3">
                                <h1 className="text-[42px] md:text-3xl font-bold tracking-wide bg-gradient-to-r from-black via-gray-700 to-black inline-block text-transparent bg-clip-text leading-tight">
                                    Design. Visualize. Export.
                                </h1>
                                <p className="text-xl md:text-lg font-medium mt-4 text-gray-700 leading-relaxed">
                                    Create stunning database schemas with our intuitive visual editor.
                                </p>
                                <div className="text-base md:text-sm mt-3 text-gray-600 leading-relaxed sliding-vertical">
                                    Build professional database designs effortlessly with drag-and-drop simplicity.
                                    Generate SQL code instantly and collaborate with your team seamlessly.
                                </div>
                            </div>
                        </FadeIn>
                        <div className="mt-8 font-semibold md:mt-12 flex flex-wrap gap-4">
                            <button
                                className="py-3 px-8 mb-4 xl:mb-0 transition-all duration-300 bg-white border-2 border-black rounded-full shadow-lg hover:bg-black hover:text-white transform hover:scale-105 font-medium"
                                onClick={() => { }
                                }
                            >
                                <IconStar className="inline mr-2" /> Explore Features
                            </button>
                            <Link
                                to="/editor"
                                className="inline-block py-3 px-6 text-white transition-all duration-300 rounded-full shadow-lg bg-black hover:bg-gray-800 transform hover:scale-105 font-medium"
                            >
                                <IconPlay className="inline mr-2" /> Start Designing <i className="bi bi-arrow-right ms-2"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-black via-gray-700 to-black inline-block text-transparent bg-clip-text mb-6">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to design, visualize, and deploy database schemas with confidence
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6">
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Section */}
            <section ref={videoSectionRef} className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-black via-gray-700 to-black inline-block text-transparent bg-clip-text mb-6">
                            See It In Action
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Watch how easy it is to create professional database schemas with our intuitive interface
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100"
                    >
                        {/* Video area: using public/video1.mp4 (place your file in the public/ folder) */}
                        <div className="w-full bg-gray-100 flex items-center justify-center">
                            <video
                                ref={videoRef}
                                className="w-full h-auto max-h-[640px] object-cover"
                                muted
                                loop
                                playsInline
                                controls
                                preload="metadata"
                                poster="/video1-poster.jpg"
                            >
                                <source src="/video1.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                       
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-black via-gray-700 to-black inline-block text-transparent bg-clip-text mb-6">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Get from concept to production-ready schema in three simple steps
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="text-center relative"
                            >
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-20 right-0 w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform translate-x-1/2" />
                                )}
                                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                                    <span className="text-2xl font-bold text-white">{step.number}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-black via-gray-700 to-black inline-block text-transparent bg-clip-text mb-6">
                            What Our Users Say
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Join thousands of developers who trust our platform for their database design needs
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <Quote className="w-8 h-8 text-gray-300 mb-4" />
                                <p className="text-gray-600 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                                <div className="border-t pt-4">
                                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                                    <p className="text-gray-500">{testimonial.role}</p>
                                    <p className="text-gray-400 text-sm">{testimonial.company}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-20 px-4 bg-black text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">
                            Ready to Build Your Next Schema?
                        </h2>
                        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                            Join thousands of developers who are already using our platform to create beautiful, 
                            efficient database schemas.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                to="/editor"
                                className="inline-flex items-center justify-center py-4 px-8 text-black bg-white rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                            >
                                Start Building Now
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <button className="inline-flex items-center justify-center py-4 px-8 text-white border-2 border-white rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
                                View Examples
                                <Eye className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
