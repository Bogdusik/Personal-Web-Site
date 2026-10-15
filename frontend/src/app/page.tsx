import { SiteHeader } from '@/components/header/SiteHeader';
import { IndexSheet } from '@/components/sheets/IndexSheet';

export default function Home() {
  return (
    <>
      <div className="mx-2 mt-2 border-x border-t border-rule">
        <SiteHeader />
      </div>
      <main id="main" tabIndex={-1} className="outline-none">
        <IndexSheet />
      </main>
    </>
  );
}
