##

<div class="Bxz(bb) D(ib) Va(t) W(100%) Pend(20px)--sm W(50%)--sm">
<h2 class="Bdw(0)! P(0) M(0)">Style with &quot;class&quot;</h2>
<p>Build whatever you want, the way you want it.<br> Adopting an [Atomic CSS architecture](frequently-asked-questions.html#what-are-the-benefits-of-atomic-css-) guarantees lower payload.</p>
</div><!--
--><div class="Bxz(bb) D(ib) Va(t) W(100%) Pstart(20px)--sm W(50%)--sm">
<h2 class="Bdw(0)! P(0) M(0)">&quot;Pay&quot; as you go</h2>
<p>Simply installing [Atomizer](/guides/atomizer.html) in your project <em>does not</em> add any bytes to your pages (there is no &quot;entry cost&quot;). &mdash; which means **Atomic can be used with any project at any time**</p>
</div>

## Colors

<div class="Row">
    <div class="Fl(start) W(60%) Fl(n)--xs W(a)--xs">
        Colors are set using hexadecimal values. Alpha transparency is created by appending the opacity value to the `hex` color.
    </div>
    <div class="Fl(start) W(60%) Cl(b) Fl(n)--xs W(a)--xs">
<pre><code class="lang-css">&lt;div class="Bgc(#<span class="hljs-number">0280ae</span>.<span class="hljs-number">5</span>) C(#fff) P(<span class="hljs-number">20</span>px)"&gt;
    <span class="hljs-comment">Lorem ipsum</span>
&lt;/div&gt;
</code></pre>
    </div>
    <div class="Fl(end) W(30%) My(1em) Fl(n)--xs W(a)--xs">
        <div class="Bgc(#0280ae.5) C(#fff) P(20px)">
            Lorem ipsum
        </div>
    </div>
</div>

## Helpers

<div class="Row">
    <div class="Fl(start) W(60%) Fl(n)--xs W(a)--xs">
        <p>Atomic offers a bunch of [helpers](/guides/helper-classes.html).</p>
        <p>In this example, we are using `LineClamp()` which takes 2 parameters.</p>
    </div>
    <div class="Fl(start) W(60%) Cl(b) Fl(n)--xs W(a)--xs">
<pre><code class="lang-html">&lt;p class="Fz(<span class="hljs-number">12</span>px) Lh(<span class="hljs-number">1</span>.<span class="hljs-number">5</span>) LineClamp(<span class="hljs-number">3</span>,<span class="hljs-number">54</span>px)"&gt;
    <span class="hljs-comment">Lorem ipsum dolor sit amet, id oratio graeco nostrum sit, latine eligendi scribentur mea ex. Tota dolorem voluptua eos at.</span>
&lt;/p&gt;
</code></pre>
    </div>
    <div class="Fl(end) W(30%) My(1em) Fl(n)--xs W(a)--xs">
        <p class="Fz(12px) Lh(1.5) LineClamp(3,54px)">Lorem ipsum dolor sit amet, id oratio graeco nostrum sit, latine eligendi scribentur mea ex.</p>
    </div>
</div>

<hr>

<p class="Ta(c)"><a class="M(20px) D(ib) Py(10px) Px(20px) Fz(20px) C(#fff) Bgc(#0280ae.8) Bdrs(2px) Bxsh(light) Tsh(1) Fw(b) Td(n):h" href="quick-start.html">Get Started</a></p>
