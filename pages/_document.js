import Document, { Head, Main, NextScript, Html } from "next/document";

export default class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html lang="ja">
				<Head>
					<style>{`body { margin: 0 } /* custom!*/`}</style>
				</Head>
				<body className="custom_class bg-red-50 font-mono">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
