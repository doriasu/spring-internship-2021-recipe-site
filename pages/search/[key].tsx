import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
	Recipe,
} from "../../lib/recipe";
import Link from "next/link";
import { SearchBar } from "..";
import { GetServerSideProps } from "next";
import Head from "../../components/head";
import Image from "next/image";
type Props = {
	recipes: Recipe[];
	num: number | null;
};
const searchPage: FC<Props> = (props) => {
	const [searchtext, setSearchtext] = useState("");
	const router = useRouter();
	const [recipes, setRecipes] = useState<Recipe[]>(props.recipes);
	const [pagenum, setPagenum] = useState<number>(props.num);
	let key = router.query.key as string;
	let num: number = +router.query.num;
	useEffect(() => {
		setRecipes(props.recipes);
		setPagenum(num ? num : 1);
	}, [key, num]);
	let ogp_url: string;
	for (let i = 0; i < props.recipes.length; i++) {
		if (props.recipes[i].image_url !== null) {
			ogp_url = props.recipes[i].image_url;
			break;
		}
	}
	return (
		<div className="bg-red-50 font-mono">
			<Head
				title="recipe research"
				description={key + "の検索結果"}
				keyword="key"
				image={ogp_url}
				url={router.pathname}
			/>
			<div className="ml-4 mr-4">
				<SearchBar />
				<br />
				<div className="text-2xl">
					<b>{key + "の検索結果"}</b>
				</div>
				<br />
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
											/>
										) : (
											<Image
												className="rounded-2xl"
												src="https://raw.githubusercontent.com/doriasu/spring-internship-2021-recipe-site/develop/resource/noimage.png"
												width="166"
												height="93"
											/>
										)}
										<div>{r.title}</div>
									</div>
								</Link>
							) : null;
						})
					) : (
						<div>No recipes founded.</div>
					)}
				</div>
				<br />
				<div className="grid grid-cols-2">
					{pagenum > 1 ? (
						<button
							onClick={() => {
								if (pagenum > 1) {
									router.push({
										pathname: "/search/" + key,
										query: { num: pagenum - 1 },
									});
								}
							}}
						>
							Prev
						</button>
					) : (
						<div></div>
					)}
					<button
						onClick={() => {
							router.push({
								pathname: "/search/" + key,
								query: { num: pagenum + 1 },
							});
						}}
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const key = String(context.params?.key);
	const num = Number(context.query.num);
	const base_url = new URL("https://internship-recipe-api.ckpd.co/search");
	base_url.searchParams.set("keyword", key);
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
			num: num,
		},
	};
};
export default searchPage;
