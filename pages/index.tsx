import { FC, useEffect, useState } from "react";
import { global_bg_color, global_img_bg_color, global_layout, Recipe } from "../lib/recipe";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
export const SearchBar: FC = () => {
	const [searchtext, setSearchtext] = useState("");
	const [searchresult, setSearchresult] = useState("");
	const [recipes, setRecipes] = useState<Recipe[] | null>(null);
	const router = useRouter();
	return (
		<div>
			<Link href="/" passHref>
				<div className="container mx-auto h-16">レシピページ</div>
			</Link>
			<div className="text-center container　">
				<input
					value={searchtext}
					onChange={(event) => {
						setSearchtext(event.target.value);
					}}
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
const mainPage: FC = () => {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const router = useRouter();
	const [pagenum, setPagenum] = useState<number>(1);
	let num: number | null = +router.query.num;
	useEffect(() => {
		(async () => {
			setPagenum(num ? num : 1);
			const base_url = new URL(
				"https://internship-recipe-api.ckpd.co/recipes"
			);
			if (num && num > 1) {
				base_url.searchParams.set("page", router.query.num as string);
			}
			const res = await fetch(base_url.toString(), {
				headers: { "X-Api-Key": process.env.NEXT_PUBLIC_APIKEY },
			});
			const recipes = await res.json();
			setRecipes(recipes["recipes"] as Recipe[]);
		})();
	}, [num]);
	return (
		<div className={global_bg_color}>
			<div className={global_layout}>
			<SearchBar />
			<br />
			<h1>新着レシピ</h1>
			<div className="grid grid-cols-2 gap-2 font-mono">
				{recipes
					? recipes.map((r) => {
							return r.image_url ? (
								<Link
									key={r.id}
									href={"/recipes/" + r.id}
									passHref
								>
									<div className={global_img_bg_color}>
										<img
											className="rounded-2xl"
											src={r.image_url}
										/>
										<div>{r.title}</div>
									</div>
								</Link>
							) : null;
					  })
					: null}
			</div>
			<br />
			<div className="grid grid-cols-2">
				{pagenum > 1 ? (
					<button
						onClick={() => {
							if (pagenum > 1) {
								router.push({
									pathname: "",
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
							pathname: "",
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
export default mainPage;
