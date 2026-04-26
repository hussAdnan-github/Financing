import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const demoAccounts = [
    { name: "فيصل الزهراني", email: "faisal@company.sa", role: "مدير", color: "bg-rose-100 text-rose-700" },
    { name: "أحمد الشمري", email: "ahmed@company.sa", role: "مشرف", color: "bg-brand-100 text-brand-700" },
    { name: "منى الزهراني", email: "mona@company.sa", role: "مدقق", color: "bg-amber-100 text-amber-700" },
    { name: "سارة المطيري", email: "sara@company.sa", role: "موظف", color: "bg-sky-100 text-sky-700" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    }
  };

  const selectDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("123456");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/820133cd-4a0c-452f-b662-b06701724b7d_-01.png?v=b2bfc75afceae2a1fe14bb1170d72133"
            alt="الشعار"
            className="h-14 w-auto object-contain mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-gray-900">تسجيل الدخول</h1>
          <p className="text-sm text-gray-500 mt-1">أدخل بياناتك للوصول إلى لوحة التحكم</p>
        </div>

        {/* Demo Accounts */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
          <p className="text-xs font-bold text-gray-700 mb-3">حسابات تجريبية سريعة</p>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => selectDemo(acc.email)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-right transition-all cursor-pointer hover:shadow-sm ${
                  email === acc.email
                    ? "border-brand-300 bg-brand-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${acc.color}`}>
                  <span className="text-[10px] font-bold">
                    {acc.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-gray-800 truncate">{acc.name}</p>
                  <p className="text-[10px] text-gray-400">{acc.role}</p>
                </div>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">كلمة المرور للجميع: 123456</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          {error && (
            <div className="px-3 py-2.5 rounded-lg bg-red-50 border border-red-100 text-red-700 text-xs font-medium flex items-center gap-2">
              <i className="ri-error-warning-line text-sm"></i>
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">البريد الإلكتروني</label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                <i className="ri-mail-line text-gray-400 text-sm"></i>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@company.sa"
                required
                className="w-full pr-9 pl-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">كلمة المرور</label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                <i className="ri-lock-line text-gray-400 text-sm"></i>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                className="w-full pr-9 pl-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className={`${showPassword ? "ri-eye-off-line" : "ri-eye-line"} text-sm`}></i>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-200" />
              <span className="text-xs text-gray-600">تذكرني</span>
            </label>
            <button type="button" className="text-xs text-brand-600 hover:underline cursor-pointer">
              نسيت كلمة المرور؟
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <i className="ri-loader-4-line animate-spin"></i>
                جاري الدخول...
              </>
            ) : (
              <>
                <i className="ri-login-box-line"></i>
                تسجيل الدخول
              </>
            )}
          </button>
        </form>

        {/* Back to landing */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/")}
            className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer flex items-center justify-center gap-1"
          >
            <i className="ri-arrow-right-line"></i>
            العودة إلى صفحة الهبوط
          </button>
        </div>
      </div>
    </div>
  );
}