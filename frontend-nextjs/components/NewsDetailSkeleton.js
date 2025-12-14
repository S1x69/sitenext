export default function NewsDetailSkeleton() {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Voltar Button Skeleton */}
        <div className="h-10 bg-muted rounded-lg w-24 mb-4 sm:mb-6"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Table of Contents Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block lg:col-span-1 lg:order-1">
            <div className="sticky top-20">
              <nav className="bg-card border rounded-xl p-4 shadow-lg">
                <div className="h-4 bg-muted rounded w-32 mb-3 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-10 bg-muted rounded-lg w-full animate-pulse"></div>
                  <div className="h-10 bg-muted rounded-lg w-full animate-pulse"></div>
                  <div className="h-10 bg-muted rounded-lg w-full animate-pulse"></div>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <article className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-card border rounded-2xl p-3 sm:p-6 md:p-8 mb-6">
              {/* Breadcrumb Skeleton */}
              <div className="h-4 bg-muted rounded w-48 mb-4 animate-pulse"></div>

              {/* Title Skeleton */}
              <div className="space-y-3 mb-4">
                <div className="h-8 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-8 bg-muted rounded w-3/4 animate-pulse"></div>
              </div>

              {/* Subtitle Skeleton */}
              <div className="space-y-2 mb-6">
                <div className="h-6 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-6 bg-muted rounded w-2/3 animate-pulse"></div>
              </div>

              {/* Meta Info Skeleton */}
              <div className="flex flex-wrap gap-6 py-4 border-t border-b mb-6">
                <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-40 animate-pulse"></div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
                <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
                <div className="h-10 bg-muted rounded w-24 animate-pulse"></div>
              </div>

              {/* Image Skeleton */}
              <div className="w-full h-[300px] md:h-[450px] bg-muted rounded-xl mb-8 animate-pulse"></div>

              {/* Content Skeleton */}
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-4/5 animate-pulse"></div>
                <div className="h-16 bg-muted/50 rounded-lg my-6 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </article>

          {/* Right Sidebar Skeleton */}
          <aside className="lg:col-span-1 order-2 lg:order-3 space-y-6">
            {/* Related News Skeleton */}
            <div className="bg-card border rounded-2xl p-6">
              <div className="h-6 bg-muted rounded w-40 mb-4 animate-pulse"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
