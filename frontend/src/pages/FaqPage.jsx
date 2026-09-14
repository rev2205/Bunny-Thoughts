import Layout from '../components/Layout';

export default function FaqPage() {
  return (
    <Layout showSidebar={false}>
      <div className="faq-container">
        <h2 className="faq-title">Frequently asked questions about Bunny Thoughts</h2>

        <div className="toc-box">
          <div className="toc-header">
            <span>::</span> Table of Contents
          </div>
          <ol className="toc-list">
            <li>
              <a href="#is-bunny-thoughts-real">Is Bunny Thoughts real?</a>
            </li>
            <li>
              <a href="#what-does-bunny-say-in-chinese">What does Bunny Thoughts say in Chinese?</a>
            </li>
            <li>
              <a href="#what-does-bunny-do-in-the-office">What does Bunny Thoughts do in The Office?</a>
            </li>
          </ol>
        </div>

        <div className="faq-item" id="is-bunny-thoughts-real">
          <h3>Is Bunny Thoughts real?</h3>
          <p>
            It is very much real! In Season 3 Episode 24 – The Job (Season 3 finale), Ryan creates a blog for Creed which is a Microsoft Word document. However, later on, the real Creed Thoughts blog was created which was written in character by the same show writers, as a nod to that episode.
          </p>
          <p>
            Bunny Thoughts captures that exact same nostalgic late-2000s blog spirit, built on a modern full-stack web engine. You can read all the thoughts right here.
          </p>
        </div>

        <div className="faq-item" id="what-does-bunny-say-in-chinese">
          <h3>What does Bunny Thoughts say in Chinese?</h3>
          <p>
            In Season 2, Episode 17 of The Office, a notable scene features Creed speaking Mandarin Chinese. He says, &quot;Wah doo zheng hua doo peng yo, nee hao,&quot; which in proper Pinyin is &quot;Wo de zhong guo de peng you, ni hao.&quot; This phrase translates to &quot;My Chinese friends, hello.&quot;
          </p>
          <p>
            In another episode, Season 7, Episode 8, Creed once again demonstrates his knowledge of Chinese. When asked by Andy to read the back of a seahorse-herb product, he states &quot;hai ma bu yao gen jiu luan gao,&quot; which translates to &quot;don&#39;t mix seahorse with alcohol.&quot; This incident humorously mirrors Andy&#39;s own mistake when he consumed the product with alcohol.
          </p>
        </div>

        <div className="faq-item" id="what-does-bunny-do-in-the-office">
          <h3>What does Bunny Thoughts do in The Office?</h3>
          <p>
            Creed is in quality assurance, however for a short stint during Season 7, he was acting manager of Dunder Mifflin Scranton. He&#39;s supposed to go to the paper suppliers to make sure the product that they&#39;re receiving meets standards.
          </p>
        </div>
      </div>
    </Layout>
  );
}
