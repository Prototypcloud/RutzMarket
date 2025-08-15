import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive updates on new products and research findings.",
      });
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-forest mb-4">
            Stay Connected with RÜTZ
          </h2>
          <p className="text-gray-600 mb-8">
            Get updates on new products, research findings, and community impact stories.
          </p>
          
          <motion.form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row max-w-md mx-auto gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sage"
              disabled={isSubscribing}
              data-testid="newsletter-email-input"
            />
            <Button
              type="submit"
              disabled={isSubscribing}
              className="bg-forest text-white px-8 py-3 rounded-lg font-semibold hover:bg-sage transition-colors disabled:opacity-50"
              data-testid="newsletter-subscribe-button"
            >
              <Mail className="w-4 h-4 mr-2" />
              {isSubscribing ? "Subscribing..." : "Subscribe"}
            </Button>
          </motion.form>
          
          <motion.p 
            className="text-sm text-gray-500 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            We respect your privacy and will never share your email.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
