import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  MapPin,
  BarChart3,
  Brain,
  Target,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Building,
  Zap,
  Star,
  Calculator,

} from "lucide-react";

export default function Home({ login }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login();
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Gagal Masuk",
        text: "Terjadi kesalahan saat login. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const businessBenefits = [
    {
      icon: <Target className="h-8 w-8 text-green-500" />,
      title: "Analisis Lokasi Akurat",
      description: "AI Gemini menganalisis foto lokasi untuk menentukan distribusi area residential, jalan, dan ruang terbuka dengan presisi tinggi",
      metric: "95% Akurasi"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Prediksi Customer Harian",
      description: "Hitung jumlah pelanggan potensial per hari berdasarkan kepadatan populasi dan pola traffic lokasi",
      metric: "Real-time Data"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
      title: "Proyeksi Revenue",
      description: "Estimasi pendapatan harian, bulanan, dan tahunan berdasarkan analisis mendalam lokasi bisnis Anda",
      metric: "ROI Calculator"
    }
  ];

  const testimonials = [
    {
      quote: "Be-Finder membantu saya menganalisis 5 lokasi berbeda. Hasilnya, toko saya di lokasi yang dipilih meraup omzet 3x lipat dari prediksi!",
      author: "Budi S., Pemilik Toko Kelontong",
      rating: 5,
    },
    {
      quote: "Analisis AI-nya sangat detail. Saya bisa lihat berapa customer potensial per hari sebelum buka usaha. Sangat membantu!",
      author: "Sari L., Pemilik Warung Makan",
      rating: 5,
    },
    {
      quote: "Platform ini menghemat waktu dan biaya riset lokasi. Dalam 5 menit saya sudah tahu potensi profit lokasi bisnis saya.",
      author: "Andi K., Pemilik Cafe",
      rating: 5,
    },
  ];

  const benefits = [
    "Analisis profitabilitas lokasi dalam hitungan menit",
    "Prediksi jumlah customer harian dengan AI Gemini",
    "Hitung proyeksi revenue bulanan dan tahunan",
    "Analisis distribusi area residential, jalan, dan ruang terbuka",
    "Estimasi ROI sebelum investasi lokasi bisnis",
    "Keputusan bisnis berbasis data yang akurat",
  ];

  const stats = [
    { number: "172", label: "Customer Harian", icon: <Users className="h-8 w-8" /> },
    { number: "2.5M", label: "Revenue Bulanan", icon: <TrendingUp className="h-8 w-8" /> },
    { number: "95%", label: "Akurasi AI", icon: <Brain className="h-8 w-8" /> },
    { number: "5 Menit", label: "Analisis Cepat", icon: <Zap className="h-8 w-8" /> },
  ];

  return (
    <main className="overflow-hidden">
      <div className="bg-dark-bg text-dark-text-primary">
        {/* Hero Section */}
        <section className="min-h-screen relative flex flex-col justify-center items-center p-4 pt-16">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-dark-bg"></div>
            <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-700"></div>
            <div className="absolute bottom-60 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-1000"></div>
          </div>
          <div className="max-w-6xl z-20 text-center relative">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-full border border-green-500/30 mb-6">
                <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                <span className="text-sm font-medium">AI-Powered Business Profitability Analysis</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent leading-tight">
              Analyze Your Business Location Profitability
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-dark-text-secondary max-w-4xl mx-auto leading-relaxed">
              AI platform that analyzes business locations and predicts daily customers,
              monthly revenue, and ROI with high accuracy using Gemini AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg text-lg font-medium hover:opacity-90 transition-all transform hover:scale-105 flex items-center justify-center disabled:opacity-50">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <BarChart3 className="h-5 w-5 mr-2" />
                )}
                {isLoading ? 'Loading...' : 'Start Free Analysis'}
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white/30 rounded-lg text-lg font-medium hover:bg-white/10 transition-all">
                Watch Demo
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-dark-text-secondary">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business Benefits Section */}
        <section id="benefits" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
                Analisis Bisnis Berbasis AI
              </h2>
              <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
                Platform canggih yang menganalisis profitabilitas lokasi bisnis dengan teknologi Gemini AI dan data real-time
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {businessBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="p-8 rounded-xl bg-gradient-to-br from-dark-surface/80 to-dark-bg/50 border border-dark-border hover:border-green-500/30 transition-all hover:transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 rounded-full mb-6 bg-gradient-to-r from-green-600/20 to-blue-600/20">
                      {benefit.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-dark-text-secondary mb-4 leading-relaxed">
                      {benefit.description}
                    </p>
                    <div className="px-4 py-2 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-full">
                      <span className="text-sm font-semibold text-green-400">{benefit.metric}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* How It Works */}
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-2xl p-8 border border-green-800/30">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-4 text-green-400">
                  Cara Kerja Platform
                </h3>
                <p className="text-dark-text-secondary text-lg max-w-2xl mx-auto">
                  Analisis profitabilitas lokasi bisnis dalam 4 langkah sederhana
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    step: "1",
                    title: "Pilih Lokasi",
                    description: "Klik pada peta untuk memilih lokasi bisnis yang ingin dianalisis",
                    icon: <MapPin className="h-6 w-6" />
                  },
                  {
                    step: "2",
                    title: "Input Parameter",
                    description: "Masukkan lebar bangunan, jam operasional, dan harga produk",
                    icon: <Target className="h-6 w-6" />
                  },
                  {
                    step: "3",
                    title: "AI Analysis",
                    description: "Gemini AI menganalisis screenshot lokasi dan menghitung metrik bisnis",
                    icon: <Brain className="h-6 w-6" />
                  },
                  {
                    step: "4",
                    title: "Lihat Hasil",
                    description: "Dapatkan proyeksi revenue dan rekomendasi profitabilitas lokasi",
                    icon: <BarChart3 className="h-6 w-6" />
                  }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        {item.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                        {item.step}
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold mb-2 text-white">{item.title}</h4>
                    <p className="text-sm text-dark-text-secondary">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-green-900/20 to-blue-900/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
                Hasil Analisis Real
              </h2>
              <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
                Contoh hasil analisis profitabilitas dari platform kami
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-dark-surface/50 rounded-xl border border-dark-border hover:border-green-500/30 transition-all">
                  <div className="flex justify-center mb-4 text-green-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-2 text-white">{stat.number}</div>
                  <div className="text-sm text-dark-text-secondary">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
              Mengapa Pilih Be-Finder?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8 rounded-2xl border-dark-border">
                <h3 className="text-2xl font-bold mb-6 text-blue-400">
                  Business Benefits
                </h3>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-dark-text-secondary">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 p-8 rounded-2xl border border-green-800/30">
                <h3 className="text-2xl font-bold mb-6 text-green-400">
                  Teknologi Canggih
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-dark-bg/30 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mr-4">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Gemini AI</h4>
                      <p className="text-sm text-dark-text-secondary">
                        Analisis gambar lokasi dengan AI terdepan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-dark-bg/30 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                      <Calculator className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Kalkulasi Akurat</h4>
                      <p className="text-sm text-dark-text-secondary">
                        12 langkah perhitungan profitabilitas bisnis
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-dark-bg/30 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-4">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Predictive Analytics</h4>
                      <p className="text-sm text-dark-text-secondary">
                        Forecast business success potential
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 px-4 bg-gradient-to-r from-dark-bg to-dark-surface">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
              Kisah Sukses Pengguna
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-green-900/20 to-blue-900/20 p-6 rounded-xl border border-green-800/30 hover:transform hover:scale-105 transition-all"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-dark-text-secondary mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <p className="font-semibold text-green-400">
                    {testimonial.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
              Siap Menganalisis Profitabilitas Bisnis Anda?
            </h2>
            <p className="text-xl text-dark-text-secondary mb-8">
              Bergabunglah dengan ribuan pebisnis yang telah mengoptimalkan lokasi usaha mereka dengan Be-Finder
            </p>
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg text-lg font-medium hover:opacity-90 transition-all transform hover:scale-105 flex items-center mx-auto disabled:opacity-50">
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <TrendingUp className="mr-2 h-5 w-5" />
              )}
              {isLoading ? 'Memuat...' : 'Mulai Analisis Sekarang'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}