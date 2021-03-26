import { FC, useEffect, useState } from "react";
import { mainProps, Recipe } from "../lib/recipe";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Head from "../components/head";
import lodash from "lodash";
export const SearchBar: FC = () => {
	const [searchtext, setSearchtext] = useState("");
	const [searchresult, setSearchresult] = useState("");
	const [recipes, setRecipes] = useState<Recipe[] | null>(null);
	const router = useRouter();
	return (
		<div>
			<Link href="/" passHref>
				<div className="container mx-auto h-16 text-center text-3xl text-san mt-8 ">Recipe Search</div>
			</Link>
			<label htmlFor="search" className="sr-only">
				search
			</label>
			<div className="text-center container　">
				<input
					value={searchtext}
					onChange={(event) => {
						setSearchtext(event.target.value);
					}}
					id="search"
					type="search"
					name="serch"
					placeholder="Search"
					className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none　border-solid border-4 border-gray-600"
					onKeyDown={(e) => {
						if (e.key == "Enter") {
							router.push("/search/" + searchtext);
						}
					}}
				/>
			</div>
		</div>
	);
};
const mainPage: FC<mainProps> = (props) => {
	const [recipes, setRecipes] = useState<Recipe[]>(props.recipes);
	let ogp_url: string;
	for (let i = 0; i < props.recipes.length; i++) {
		if (props.recipes[i].image_url !== null) {
			ogp_url = props.recipes[i].image_url;
			break;
		}
	}
	const router = useRouter();
	const [pagenum, setPagenum] = useState<number>(props.num ? props.num : 1);
	useEffect(() => {
		getPost();

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [pagenum]);
	// 一番下に到達したらsetPageNumberでページ番号を更新
	const handleScroll = lodash.throttle(() => {
		if (
			Math.ceil(
				window.innerHeight + document.documentElement.scrollTop
			) !== document.documentElement.offsetHeight
		) {
			return;
		}
		setPagenum(pagenum + 1);
	}, 200);

	const getPost = async () => {
		if (pagenum == 1) {
			return;
		}
		const base_url = new URL(
			"https://internship-recipe-api.ckpd.co/recipes"
		);
		if (pagenum && pagenum > 1) {
			base_url.searchParams.set("page", String(pagenum));
		}
		const res = await fetch(base_url.toString(), {
			headers: { "X-Api-Key": process.env.NEXT_PUBLIC_APIKEY },
		});
		let get_recipes = await res.json();
		get_recipes = get_recipes.recipes as Recipe[];
		let postsNext = recipes.concat(get_recipes);
		setRecipes(postsNext);
	};

	return (
		<div className="bg-red-50 font-mono">
			<Head
				title="recipe page"
				description="新着レシピ"
				keyword="key"
				image={ogp_url}
				url="https://takuro-spring-internship-2021-recipe-site.vercel.app/"
			/>

			<div className="ml-4 mr-4">
				<SearchBar />
				<br />
				<div className="text-2xl text-center">
					<b>新着レシピ</b>
				</div>
				<br />
				<div className="grid grid-cols-2 gap-2">
					{recipes
						? recipes.map((r) => {
								return r ? (
									<Link
										key={r.id}
										href={"/recipes/" + r.id}
										passHref
									>
										<div className="border border-black rounded-2xl bg-gray-200">
											{r.image_url ? (
												<Image
													className="rounded-2xl"
													src={r.image_url}
													width="166"
													height="93"
													alt={r.title}
												/>
											) : (
												<Image
													className="rounded-2xl"
													src="https://raw.githubusercontent.com/doriasu/spring-internship-2021-recipe-site/develop/resource/noimage.png"
													width="166"
													height="93"
													alt={r.title}
												/>
											)}
											<div className="text-center">
												{r.title}
											</div>
										</div>
									</Link>
								) : null;
						  })
						: null}
				</div>
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const query = context.query.num;
	let num: number | null = +query;
	const base_url = new URL("https://internship-recipe-api.ckpd.co/recipes");
	if (num && num > 1) {
		base_url.searchParams.set("page", String(num));
	}
	const res = await fetch(base_url.toString(), {
		headers: { "X-Api-Key": process.env.NEXT_PUBLIC_APIKEY },
	});
	let recipes = await res.json();
	recipes = recipes.recipes as Recipe[];
	return {
		props: {
			recipes: recipes,
			num: num ? num : 1,
		},
	};
};
export default mainPage;
