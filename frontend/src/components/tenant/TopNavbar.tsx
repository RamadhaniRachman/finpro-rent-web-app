import React from "react";

interface TopNavBarProps {
  title: string;
  subtitle: string;
}

export default function TopNavBar({ title, subtitle }: TopNavBarProps) {
  return (
    <header className="w-full sticky top-0 z-40 backdrop-blur-md bg-surface/80 shadow-sm flex justify-between items-center px-8 py-4">
      <div>
        <h2 className="font-headline-sm text-2xl font-bold text-primary">
          {title}
        </h2>
        <p className="font-label-md text-sm text-on-surface-variant">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group cursor-pointer">
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
            notifications
          </span>
          <div className="w-2 h-2 bg-error rounded-full absolute right-0 top-0 border-2 border-surface"></div>
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/30">
          <div className="text-right">
            <p className="font-label-md text-sm font-bold text-primary">
              Sarah Jenkins
            </p>
            <p className="text-[11px] text-on-surface-variant uppercase tracking-wider">
              Premium Host
            </p>
          </div>
          <img
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-secondary-container"
            src="https://api.dicebear.com/7.x/initials/svg?seed=SarahJenkins&backgroundColor=56642b"
          />
        </div>
      </div>
    </header>
  );
}
