import { Link } from "react-router-dom";
import SimpleCanvas from "../../components/landing/SimpleCanvas";
import FadeIn from "../../components/animations/FadeIn";
import Navbar from "../../components/landing/Navbar";
import { diagram } from "../../utils/constants";
import { IconPlay, IconStar } from "@douyinfe/semi-icons";


export default function LandingPage() {

    return (
        <div>
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
        </div>
    );
}
