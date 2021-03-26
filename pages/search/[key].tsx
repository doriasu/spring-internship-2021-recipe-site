import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Recipe } from "../../lib/recipe";
import Link from "next/link";
import { SearchBar } from "..";
import { GetServerSideProps } from "next";
import Head from "../../components/head";
import Image from "next/image";
import lodash from "lodash";
type Props = {
	recipes: Recipe[];
	num: number | null;
	keyword: string;
};
const searchPage: FC<Props> = (props) => {
	const [searchtext, setSearchtext] = useState("");
	const router = useRouter();
	const [recipes, setRecipes] = useState<Recipe[]>(props.recipes);
	const [pagenum, setPagenum] = useState<number>(props.num ? props.num : 1);
	const [keyword, setKeyword] = useState<string>(props.keyword);
	let num: number = +router.query.num;
	useEffect(() => {
		if (props.keyword !== keyword) {
			setKeyword(props.keyword);
			setRecipes(props.recipes);
			setPagenum(1);
		} else {
			getPost();
		}

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [pagenum, props]);
	let ogp_url: string;
	for (let i = 0; i < props.recipes.length; i++) {
		if (props.recipes[i].image_url !== null) {
			ogp_url = props.recipes[i].image_url;
			break;
		}
	}
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
			"https://internship-recipe-api.ckpd.co/search"
		);
		base_url.searchParams.set("keyword", props.keyword);
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
				title="recipe research"
				description={props.keyword + "の検索結果"}
				keyword="key"
				image={ogp_url}
				url={
					"https://takuro-spring-internship-2021-recipe-site.vercel.app/search/" +
					props.keyword
				}
			/>
			<div className="ml-4 mr-4">
				<SearchBar />
				<br />
				<div className="text-2xl text-center">
					<b>{props.keyword + "の検索結果"}</b>
				</div>
				<br />
				{recipes.length > 0 ? (
					<div className="grid grid-cols-2 gap-2">
						{recipes ? (
							recipes.map((r) => {
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
						) : (
							<div>No recipes founded.</div>
						)}
					</div>
				) : (
					<div className="text-center text-2xl">Not Found</div>
				)}
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const key = String(context.params?.key);
	const num = Number(context.query.num ? context.query.num : "1");
	const base_url = new URL("https://internship-recipe-api.ckpd.co/search");
	base_url.searchParams.set("keyword", key);
	if (num && num > 1) {
		base_url.searchParams.set("page", String(num));
	}
	const res = await fetch(base_url.toString(), {
		headers: { "X-Api-Key": process.env.NEXT_PUBLIC_APIKEY },
	});
	let recipes = await res.json();
	if (recipes.message) {
		recipes = [] as Recipe[];
	} else {
		recipes = recipes.recipes as Recipe[];
	}
	return {
		props: {
			recipes: recipes,
			num: num,
			keyword: key,
		},
	};
};
export default searchPage;
