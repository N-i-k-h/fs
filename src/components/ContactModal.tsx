import { X, Users, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <X className="w-4 h-4 text-gray-600" />
                </button>

                <div className="text-center pt-4 pb-2">
                    <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-teal" />
                    </div>
                    <h3 className="text-2xl font-bold text-navy">Ready to find your space?</h3>
                    <p className="text-muted-foreground mt-2 px-4">
                        Join hundreds of businesses that found their perfect workspace through FlickSpace.
                    </p>
                </div>

                <div className="space-y-3 mt-8">
                    <Button
                        variant="teal"
                        className="w-full h-12 text-lg font-bold shadow-lg shadow-teal/20"
                        onClick={() => {
                            onClose();
                            navigate('/search');
                        }}
                    >
                        Start Your Search
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full h-12 text-lg font-semibold border-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                        onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                    >
                        <Phone className="w-5 h-5 mr-2" /> WhatsApp Us
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
