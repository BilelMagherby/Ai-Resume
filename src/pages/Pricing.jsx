import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Check,
  X,
  Star,
  Zap,
  Crown,
  ArrowRight,
  Sparkles
} from 'lucide-react'

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: Star,
      color: 'gray',
      features: [
        '1 CV Template',
        'Basic PDF Export',
        'Limited AI Suggestions',
        'Community Support',
        'SmartCV+ Watermark'
      ],
      excluded: [
        'Custom Domain',
        'Priority Support',
        'Advanced Analytics',
        'All Templates Access'
      ],
      buttonText: 'Get Started',
      buttonColor: 'gray',
      popular: false
    },
    {
      name: 'Premium',
      price: '$9',
      period: '/month',
      description: 'Most popular for professionals',
      icon: Zap,
      color: 'blue',
      features: [
        'Unlimited CVs',
        'All Premium Templates',
        'Advanced AI Optimization',
        'No Watermark',
        'Priority Support',
        'Custom Domain',
        'Advanced Analytics',
        'Export to Multiple Formats'
      ],
      excluded: [],
      buttonText: 'Start Free Trial',
      buttonColor: 'blue',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For teams and organizations',
      icon: Crown,
      color: 'purple',
      features: [
        'Everything in Premium',
        'Team Collaboration',
        'White Label Solution',
        'API Access',
        'Dedicated Support',
        'Custom Integrations',
        'Advanced Security',
        'SLA Guarantee'
      ],
      excluded: [],
      buttonText: 'Contact Sales',
      buttonColor: 'purple',
      popular: false
    }
  ]

  const faqs = [
    {
      question: 'Can I change my plan later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
    },
    {
      question: 'Is there a free trial for Premium?',
      answer: 'Yes! We offer a 14-day free trial for Premium plans with full access to all features.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely! You can cancel your subscription at any time. No questions asked.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg" />
              <span className="text-xl font-bold gradient-text">SmartCV+</span>
            </Link>

            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Simple, transparent pricing</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Choose Your Plan</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start free and upgrade as you grow. No hidden fees, no surprises.
          </p>

          <div className="flex items-center justify-center space-x-4">
            <span className="text-gray-600">Monthly</span>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
            </button>
            <span className="text-gray-600">Yearly (Save 20%)</span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative block-container
                ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''}
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-16 h-16 bg-${plan.color}-100 rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                  <plan.icon className={`w-8 h-8 text-${plan.color}-600`} />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}

                {plan.excluded.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3 opacity-50">
                    <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-500">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                to={plan.name === 'Enterprise' ? '/contact' : '/dashboard'}
                className={`
                  w-full block text-center py-3 px-4 rounded-lg font-medium transition-all
                  ${plan.buttonColor === 'blue'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                    : plan.buttonColor === 'purple'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }
                `}
              >
                {plan.buttonText}
                <ArrowRight className="inline-block w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Compare Features</h2>

          <div className="block-container overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Premium</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 text-gray-700">Number of CVs</td>
                  <td className="text-center py-4 px-6 text-gray-600">1</td>
                  <td className="text-center py-4 px-6 text-gray-600">Unlimited</td>
                  <td className="text-center py-4 px-6 text-gray-600">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 text-gray-700">Templates</td>
                  <td className="text-center py-4 px-6 text-gray-600">Basic</td>
                  <td className="text-center py-4 px-6 text-gray-600">All</td>
                  <td className="text-center py-4 px-6 text-gray-600">All + Custom</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 text-gray-700">AI Optimization</td>
                  <td className="text-center py-4 px-6"><X className="w-5 h-5 text-gray-400 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 text-gray-700">Custom Domain</td>
                  <td className="text-center py-4 px-6"><X className="w-5 h-5 text-gray-400 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 text-gray-700">Priority Support</td>
                  <td className="text-center py-4 px-6"><X className="w-5 h-5 text-gray-400 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="block-container"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default Pricing
